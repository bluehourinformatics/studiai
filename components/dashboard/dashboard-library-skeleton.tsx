import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLibrarySkeleton({
  viewMode = "grid",
}: {
  viewMode?: "grid" | "list";
}) {
  // Create an array of 6 items to match your book list size
  const skeletons = Array.from({ length: 6 });

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
      }
    >
      {skeletons.map((_, i) => (
        <Card key={i} className="glass border-border/50">
          <CardContent
            className={
              viewMode === "grid" ? "p-5" : "p-4 flex items-center gap-4"
            }
          >
            {/* Book Icon Skeleton */}
            <Skeleton
              className={`rounded-lg shrink-0 ${viewMode === "grid" ? "h-28 w-full mb-4" : "h-12 w-9"}`}
            />

            <div className="flex-1 min-w-0 space-y-3">
              {/* Title Skeleton */}
              <Skeleton className="h-4 w-3/4" />

              {/* Badge and Page count skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>

              {/* Progress Bar skeleton */}
              <div className="flex items-center gap-2 mt-3">
                <Skeleton className="h-1.5 flex-1" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
