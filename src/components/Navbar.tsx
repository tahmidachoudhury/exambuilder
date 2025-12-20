"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, List, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 mr-8">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">
            Maths Exam Builder
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pathname === "/"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Exam Builder</span>
          </Link>
          <Link
            href="/topics"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pathname === "/topics"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Topic List</span>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
