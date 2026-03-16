import BookList from "@/components/dashboard/library/book-list";
import BookListSkeleton from "@/components/dashboard/library/book-list-skeleton";
import { Button } from "@/components/ui/button";
import { getAllBooks } from "@/lib/actions/book";
import { auth } from "@clerk/nextjs/server";
import { Upload } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DashboardHomePage(props: {
  searchParams?: Promise<{ search: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search;
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">
            Welcome back, Student 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's your books.</p>
        </div>
        <Link href={"/dashboard/upload"}>
          <Button className="gap-2">
            <Upload className="h-4 w-4" /> Upload PDF
          </Button>
        </Link>
      </div>
      <BookTable userId={userId} search={search} />
    </div>
  );
}

async function BookTable({
  userId,
  search,
}: {
  userId: string;
  search?: string;
}) {
  const { success, data: books } = await getAllBooks(userId, search);
  if (!success) {
    throw new Error("Failed to fetch books");
  }

  return (
    <Suspense key={books?.length} fallback={<BookListSkeleton />}>
      <BookList books={books!} />
    </Suspense>
  );
}
