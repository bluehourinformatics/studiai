import z from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
} from "./constants";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  pdfFile: z
    .instanceof(File, { message: "Please upload a PDF file" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Max PDF size is ${MAX_FILE_SIZE} bytes`,
    )
    .refine(
      (file) => file.type === ACCEPTED_PDF_TYPES,
      "Only .pdf files are accepted",
    ),

  coverFile: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      `Max image size is ${MAX_IMAGE_SIZE} bytes`,
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Invalid image type",
    ),
});

export type CreateBookValues = z.infer<typeof createBookSchema>;

export const editBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
});

export type EditBookValues = z.infer<typeof editBookSchema>;
