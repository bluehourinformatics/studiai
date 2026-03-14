"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IBook } from "@/lib/types";
import { editBookSchema, EditBookValues } from "@/lib/zod";
import { updateBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
// Replace with your actual server action
// import { updateBook } from "@/lib/actions/book";

interface EditBookDialogProps {
  book: IBook;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function EditBookDialog({ book, open, setOpen }: EditBookDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditBookValues>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
    },
  });

  const router = useRouter();

  async function onSubmit(values: EditBookValues) {
    try {
      setIsSubmitting(true);
      const result = await updateBook(book._id, values);
      if (result.success) {
        toast.success("Book updated");
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (open) {
      form.reset({
        title: book.title,
        author: book.author,
      });
    }
  }, [book, form, open]);

  function handleOpenChange(newOpen: boolean): void {
    if (!newOpen) {
      form.reset(); // Clear any unsaved typing when closing
    }
    setOpen(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center">
          <Edit className="mr-2 h-4 w-4" />
          Edit Book
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the title and author of your book.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Book title" />
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
                    <Input {...field} placeholder="Author name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)} // This triggers handleOpenChange
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
