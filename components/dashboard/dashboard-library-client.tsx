"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Upload,
  MessageSquare,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DeleteDialog } from "../delete-dialog";
import { deleteBook } from "@/lib/actions/book";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import Image from "next/image";

const subjectColors: Record<string, string> = {
  CS: "bg-primary/10 text-primary border-primary/20",
  Chemistry: "bg-accent/10 text-accent border-accent/20",
  Physics: "bg-destructive/10 text-destructive border-destructive/20",
  Math: "bg-secondary text-secondary-foreground border-border",
};

export default function DashboardLibraryClient({ books }: { books: any }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [deletingBookId, setDeletingBookId] = useState();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // const filtered = books.filter((b: any) =>
  //   b.title.toLowerCase().includes(search.toLowerCase()),
  // );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">My Library</h1>
          <p className="text-muted-foreground mt-1">
            {books.length} books uploaded
          </p>
        </div>
        <Link href={"/dashboard/upload"}>
          <Button className="gap-2">
            <Upload className="h-4 w-4" /> Upload PDF
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            className="pl-9 bg-muted/50 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 border border-border/50 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={
          viewMode === "grid"
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        }
      >
        {books.map((book: any) => (
          <Card
            key={book.slug}
            className="glass border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
            onClick={() => router.push(`/dashboard/chat/${book.slug}`)}
          >
            <CardContent
              className={
                viewMode === "grid" ? "p-5" : "p-4 flex items-center gap-4"
              }
            >
              <div
                className={`rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ${viewMode === "grid" ? "h-28 w-full mb-4" : "h-12 w-9"}`}
              >
                {book.coverURL ? (
                  <Image
                    src={book.coverURL}
                    alt="cover"
                    width={48}
                    height={36}
                    className={
                      viewMode === "grid"
                        ? "h-8 w-8 text-primary object-cover"
                        : "h-4 w-4 text-primary"
                    }
                  />
                ) : (
                  <BookOpen
                    className={
                      viewMode === "grid"
                        ? "h-8 w-8 text-primary"
                        : "h-4 w-4 text-primary"
                    }
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm truncate">{book.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/chat/${book.slug}`)
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2" /> Open Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setDeletingBookId(book._id);
                          setOpen(true);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {/* <Badge
                    variant="outline"
                    className={`text-xs ${subjectColors[book.subject] || ""}`}
                  >
                    {book.author}
                  </Badge> */}
                  <span className="text-xs text-muted-foreground">
                    {book.author}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {book.pages} pages
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-6">
                  <Progress value={book.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {book.progress}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
      {deletingBookId && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete book and all associated book
                segments. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async (e) => {
                  e.preventDefault(); // Stop default close behavior
                  await deleteBook(deletingBookId);
                  setOpen(false);
                  setDeletingBookId(undefined);
                  toast.success("Book deleted");
                  router.refresh();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
