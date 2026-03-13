"use client";
import {
  BookOpen,
  Home,
  Library,
  MessageCircle,
  Brain,
  BarChart3,
  Upload,
  Settings,
  Coffee,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Show, UserButton } from "@clerk/nextjs";

const navItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "Library", url: "/dashboard/library", icon: Library },
  { title: "Voice Chat", url: "/dashboard/chat", icon: MessageCircle },
  { title: "Plans", url: "/dashboard/subscription", icon: Coffee },
  //   { title: "Quiz", url: "/dashboard/quiz", icon: Brain },
  //   { title: "Progress", url: "/dashboard/progress", icon: BarChart3 },
  { title: "Upload", url: "/dashboard/upload", icon: Upload },
];

export function DashboardHeader() {
  return (
    <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 shrink-0 gap-6">
      <a href="/dashboard" className="flex items-center gap-2 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <span className="text-lg font-bold font-display">
          Studi<span className="text-gradient-primary">AI</span>
        </span>
      </a>

      <nav className="flex items-center gap-1  overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            href={item.url}
            exact={true}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors whitespace-nowrap"
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
