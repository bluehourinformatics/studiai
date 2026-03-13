import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const recentBooks = [
  {
    title: "Introduction to Machine Learning",
    progress: 72,
    lastAccessed: "2h ago",
  },
  {
    title: "Organic Chemistry Fundamentals",
    progress: 45,
    lastAccessed: "1d ago",
  },
  { title: "Modern Physics Vol. 2", progress: 18, lastAccessed: "3d ago" },
];

const DashboardRecentBooks = () => {
  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Continue Studying</CardTitle>
        <Link href={"/dashboard/library"}>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentBooks.map((book) => (
          <Link
            key={book.title}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            href={"/dashboard/chat"}
          >
            <div className="h-12 w-9 rounded bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{book.title}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <Progress value={book.progress} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground shrink-0">
                  {book.progress}%
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {book.lastAccessed}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardRecentBooks;
