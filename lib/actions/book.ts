"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "../db/connect";
import Book from "../models/book.model";
import { extractText } from "unpdf";
import {
  escapeRegex,
  generateSlug,
  serializeData,
  splitIntoSegments,
} from "../utils";
import BookSegment from "../models/book-segment.model";
import { UTApi } from "uploadthing/server";
import { CreateBookValues } from "../zod";
import { revalidatePath } from "next/cache";
import { PlanLevel } from "../constants";
import { checkPlanLimits } from "./session";
import { TextSegment } from "../types";

const utapi = new UTApi();

export const getAllBooks = async (search?: string) => {
  try {
    await connectDB();

    let query = {};

    if (search) {
      const escapedSearch = escapeRegex(search);
      const regex = new RegExp(escapedSearch, "i");

      query = {
        $or: [{ title: { $regex: regex } }, { author: { $regex: regex } }],
      };

      const books = await Book.find(query).sort({ createdAt: -1 }).lean();
      return {
        success: true,
        data: serializeData(books),
      };
    }

    const books = await Book.find();
    return {
      success: true,
      data: serializeData(books),
    };
  } catch (error) {
    console.error("Error connecting to database", error);
    return {
      success: false,
      error,
    };
  }
};

export const isBookExists = async (title: string) => {
  try {
    await connectDB();
    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }

    return {
      exists: false,
    };
  } catch (error) {
    console.error("Error checking book exists", error);
    return {
      exists: false,
      error,
    };
  }
};

export async function deleteBook(bookId: string) {
  try {
    await BookSegment.deleteMany({ bookId });
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return { success: false, message: "Book not found" };
    }

    await utapi.deleteFiles([
      deletedBook.fileBlobKey,
      deletedBook.coverBlobKey,
    ]);

    revalidatePath("/dashboard/library");
    return {
      success: true,
      message: `Deleted: ${deletedBook.title}`,
    };
  } catch (error) {
    return { success: false, error: "Deletion failed" };
  }
}

export const createBook = async (values: CreateBookValues) => {
  let fileURL = null;
  let fileBlobKey = null;
  let coverURL = null;
  let coverBlobKey = null;

  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    await connectDB();

    const plan = (user.publicMetadata.plan as PlanLevel) || "free";
    const limitCheck = await checkPlanLimits(user.id, plan);
    if (!limitCheck.allowed) {
      return { success: false, error: limitCheck.message };
    }

    const response = await utapi.uploadFiles(values.pdfFile);
    if (!response.data) {
      return { success: false, error: "Upload failed" };
    }

    fileURL = response.data.ufsUrl;
    fileBlobKey = response.data.key;

    if (values.coverFile) {
      const coverResp = await utapi.uploadFiles(values.coverFile);
      if (!coverResp.data) {
        return { success: false, error: "Upload failed" };
      }

      coverURL = coverResp.data.ufsUrl;
      coverBlobKey = coverResp.data.key;
    }

    // Todo: Check subscription limits
    // const parseData = parsePDFFile(file);extractTextFromPDF
    const slug = generateSlug(values.title);
    const book = await Book.create({
      title: values.title,
      author: values.author,
      clerkId: user.id,
      slug,
      fileURL,
      fileBlobKey,
      coverURL,
      coverBlobKey,
      fileSize: values.pdfFile.size,
      totalSegments: 0,
    });

    revalidatePath("/dashboard/library");

    return {
      success: true,
      book: serializeData(book),
    };
  } catch (error) {
    console.error("Error creating a book", error);
    if (fileBlobKey) {
      utapi.deleteFiles([fileBlobKey]);
    }

    if (coverBlobKey) {
      utapi.deleteFiles([coverBlobKey]);
    }

    return {
      success: false,
      error,
    };
  }
};

export const getBookBySlug = async (slug: string) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    await connectDB();

    const book = await Book.findOne({ slug }).lean();

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    console.error("Error fetching book by slug", error);
    return {
      success: false,
      error,
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  segments: TextSegment[],
) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthorized");

    await connectDB();

    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        clerkId: user.id,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);
    await Book.findByIdAndUpdate(bookId, {
      totalSegments: segments.length,
    });

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    };
  } catch (error) {
    console.error("Error saving book segments", error);

    return {
      success: false,
      error: error,
    };
  }
};

export const searchBookSegments = async (
  bookId: string,
  query: string,
  limit: number = 5,
) => {
  try {
    await connectDB();

    console.log(`Searching for: "${query}" in book ${bookId}`);

    // const bookObjectId = new mongoose.Types.ObjectId(bookId);

    // Try MongoDB text search first (requires text index)
    let segments: Record<string, unknown>[] = [];
    try {
      segments = await BookSegment.find({
        bookId: bookId,
        $text: { $search: query },
      })
        .select("_id bookId content segmentIndex pageNumber wordCount")
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean();
    } catch {
      // Text index may not exist — fall through to regex fallback
      segments = [];
    }

    // Fallback: regex search matching ANY keyword
    if (segments.length === 0) {
      const keywords = query.split(/\s+/).filter((k) => k.length > 2);
      const pattern = keywords.map(escapeRegex).join("|");

      segments = await BookSegment.find({
        bookId: bookId,
        content: { $regex: pattern, $options: "i" },
      })
        .select("_id bookId content segmentIndex pageNumber wordCount")
        .sort({ segmentIndex: 1 })
        .limit(limit)
        .lean();
    }

    console.log(`Search complete. Found ${segments.length} results`);

    return {
      success: true,
      data: serializeData(segments),
    };
  } catch (error) {
    console.error("Error searching segments:", error);
    return {
      success: false,
      error: (error as Error).message,
      data: [],
    };
  }
};

export async function extractTextFromPDF(file: File): Promise<{
  totalPages: number;
  text: string;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return await extractText(uint8Array, { mergePages: true });
}
