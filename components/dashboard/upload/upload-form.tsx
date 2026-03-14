"use client";
import { motion } from "framer-motion";
import { Upload, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { createBookSchema, CreateBookValues } from "@/lib/zod";
import {
  createBook,
  deleteBook,
  isBookExists,
  saveBookSegments,
} from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import {
  UploadProgressDialog,
  UploadStage,
} from "@/components/dashboard/upload/upload-progress-dialog";
import { dataURLtoFile, parsePDFFile } from "@/lib/utils";

export default function UploadForm() {
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [coverName, setCoverName] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadStage, setUploadStage] = useState<UploadStage>("uploading");
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const form = useForm<CreateBookValues>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      author: "",
    },
  });

  const handlePdfSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setPdfName(file.name);
      form.setValue("pdfFile", file);
    },
    [form],
  );

  const handleCoverSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setCoverName(file.name);
      form.setValue("coverFile", file);
    },
    [],
  );

  const onSubmit = async (values: CreateBookValues) => {
    // Send to your server
    try {
      const existingBook = await isBookExists(values.title);
      if (existingBook.exists) {
        toast.info("Book already exists with same title.");
        form.reset();
        return;
      }

      setUploadDialogOpen(true);
      setUploadStage("uploading");
      setUploadProgress(0);

      const parsedData = await parsePDFFile(values.pdfFile);
      if (!parsedData.content) {
        toast.error("Unable to parse the book.");
        form.reset();
        return;
      }

      if (!values.coverFile) {
        values.coverFile = dataURLtoFile(
          parsedData.cover,
          `${values.title}_thumbnail.png`,
        );
      }

      setUploadProgress(20);

      const result = await createBook(values);
      if (!result.success) {
        toast.error("Error while creating book.");
        form.reset();
        setUploadDialogOpen(false);
        return;
      }

      setUploadStage("synthesizing");
      setUploadProgress(40);

      const segmentResult = await saveBookSegments(
        result.book._id,
        parsedData.content,
      );

      if (!segmentResult.success) {
        await deleteBook(result.book._id);
        toast.error("Error in segment creation.");
        form.reset();
        setPdfName(null);
        setCoverName(null);
        return;
      }

      setUploadProgress(100);
      setUploadStage("done");
      toast.success("Book created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Upload failed");
    }
    //
    form.reset();
    setPdfName(null);
    setCoverName(null);
    setUploadDialogOpen(false);
  };
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Book Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Book title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* PDF File */}
                <div className="space-y-3">
                  <FormLabel>PDF File</FormLabel>
                  <div
                    className="border-2 border-dashed border-border/50 hover:border-primary/40 rounded-xl p-6 text-center cursor-pointer transition-colors"
                    onClick={() =>
                      document.getElementById("pdf-input")?.click()
                    }
                  >
                    <input
                      id="pdf-input"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handlePdfSelect}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">
                        {pdfName || "Click to upload PDF"}
                      </p>
                      <p className="text-xs text-muted-foreground">Max 20MB</p>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-3">
                  <FormLabel>Cover Image (optional)</FormLabel>
                  <div
                    className="border-2 border-dashed border-border/50 hover:border-primary/40 rounded-xl p-6 text-center cursor-pointer transition-colors"
                    onClick={() =>
                      document.getElementById("cover-input")?.click()
                    }
                  >
                    <input
                      id="cover-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverSelect}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Image className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">
                        {coverName || "Click to upload cover"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, WebP
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Upload className="h-4 w-4" /> Create Book
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
      <UploadProgressDialog
        open={uploadDialogOpen}
        stage={uploadStage}
        progress={uploadProgress}
        fileName={pdfName || undefined}
      />
    </div>
  );
}
