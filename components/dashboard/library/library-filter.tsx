"use client";

import { Input } from "@/components/ui/input";
import { Grid3X3, List, Search } from "lucide-react";
import { useState } from "react";
import SearchBar from "../search-bar";

export default function LibraryFilter() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  return (
    <div className="flex items-center gap-3">
      <SearchBar />
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
  );
}
