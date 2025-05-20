"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, FileText, GalleryVerticalEnd, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function TabNavigation() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const tabs = [
    {
      name: "Exam Builder",
      href: "/",
      icon: FileText,
    },
    {
      name: "Topic List",
      href: "/topics",
      icon: BookOpen,
    },
  ]

  return (
    <div className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-6" />
            </div>
            Maths Exam Builder.
          </h1>

          <nav className="flex items-center gap-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </Link>
              )
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}
