"use client";

import { useState, useMemo } from "react";
import { Search, ExternalLink, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Categories } from "@/lib/topics";
import { Category, Topic } from "@/types/exam";
// import { Navbar } from "@/components/Navbar";

export default function TopicList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Filter topics based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return Categories;
    }

    const query = searchQuery.toLowerCase();
    return Categories.map((category) => ({
      ...category,
      topics: category.topics.filter((item) =>
        item.topic.toLowerCase().includes(query)
      ),
    })).filter((category) => category.topics.length > 0);
  }, [searchQuery]);

  // Get all topics that match search for flat display
  const flatFilteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: {
      category: Category;
      categoryName: string;
      topic: Topic;
    }[] = [];

    Categories.forEach((category) => {
      category.topics.forEach((item) => {
        if (item.topic.toLowerCase().includes(query)) {
          results.push({
            category,
            categoryName: category.name,
            topic: item,
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  const handleTopicClick = (slug: string) => {
    const finalUrl = `https://mathsgenie.co.uk/${slug}`;
    // Open in new tab, matching behavior from `topic-item.tsx`
    if (typeof window !== "undefined") {
      window.open(finalUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Topic List
          </h1>
          <p className="text-muted-foreground">
            Browse topics by category. Click a topic to open it.
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search all topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Sidebar - Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                Categories
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedCategory === null
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  All Categories
                </button>
                {Categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selectedCategory === category.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {category.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({category.topics.length})
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Empty State */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  No topics match your search
                </h3>
                <p className="text-muted-foreground text-sm">
                  Try a different search term or browse by category.
                </p>
              </div>
            )}

            {/* Search Results - Flat List */}
            {flatFilteredTopics && flatFilteredTopics.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  {flatFilteredTopics.length} topic
                  {flatFilteredTopics.length !== 1 ? "s" : ""} found
                </p>
                {flatFilteredTopics.map(({ topic, categoryName }) => (
                  <TopicRow
                    key={`${categoryName}-${topic.url}`}
                    topic={topic}
                    categoryName={categoryName}
                    onClick={() => handleTopicClick(topic.url)}
                  />
                ))}
              </div>
            )}

            {/* Category View - Accordion on Mobile, List on Desktop */}
            {!searchQuery.trim() && (
              <>
                {/* Mobile Accordion */}
                <div className="lg:hidden">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="category-1"
                    className="space-y-2"
                  >
                    {filteredCategories.map((category) => (
                      <AccordionItem
                        key={category.id}
                        value={`category-${category.id}`}
                        className="border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                          <span className="font-medium">{category.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({category.topics.length})
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="divide-y divide-border">
                            {category.topics.map((topic) => (
                              <TopicRow
                                key={topic.url}
                                topic={topic}
                                onClick={() => handleTopicClick(topic.url)}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Desktop Category List */}
                <div className="hidden lg:block space-y-6">
                  {(selectedCategory
                    ? filteredCategories.filter(
                        (c) => c.id === selectedCategory
                      )
                    : filteredCategories
                  ).map((category) => (
                    <section key={category.id}>
                      <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        {category.name}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({category.topics.length})
                        </span>
                      </h2>
                      <div className="grid gap-2">
                        {category.topics.map((topic) => (
                          <TopicRow
                            key={topic.url}
                            topic={topic}
                            onClick={() => handleTopicClick(topic.url)}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface TopicRowProps {
  topic: Topic;
  categoryName?: string;
  onClick: () => void;
}

function TopicRow({ topic, categoryName, onClick }: TopicRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-lg",
        "bg-card hover:bg-accent/50 border border-border",
        "transition-colors group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground truncate">{topic.topic}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {categoryName && (
              <span className="text-primary/80">{categoryName} · </span>
            )}
            {topic.url}
          </p>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity shrink-0" />
      </div>
    </button>
  );
}
