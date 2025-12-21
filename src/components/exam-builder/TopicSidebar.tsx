import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, BookOpen, Search, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopicCategory, Topic } from "@/types/exam";
import { topics } from "@/lib/topics";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TopicSidebarProps {
  categories: TopicCategory[];
  selectedTopic: string | null;
  onSelectTopic: (topicId: string) => void;
  isLoading?: boolean;
}

export function TopicSidebar({
  categories,
  selectedTopic,
  onSelectTopic,
  isLoading,
}: TopicSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map((c) => c.name)
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      topics: category.topics.filter((item) =>
        item.topic.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.topics.length > 0);

  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-semibold text-foreground">Topics</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Topic List */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-2">
          {filteredCategories.map((category) => (
            <div key={category.name} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
              >
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    expandedCategories.includes(category.name) && "rotate-90"
                  )}
                />
                <span>{category.name}</span>
                <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">
                  {category.topics.length}
                </span>
              </button>

              {/* Topics */}
              <AnimatePresence>
                {expandedCategories.includes(category.name) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 space-y-0.5">
                      {category.topics.map((topic) => (
                        <TopicItem
                          key={topic.topic}
                          topic={topic}
                          isSelected={selectedTopic === topic.topic}
                          onClick={() => onSelectTopic(topic.topic)}
                          isLoading={isLoading && selectedTopic === topic.topic}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No topics found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

interface TopicItemProps {
  topic: Topic;
  isSelected: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

function TopicItem({ topic, isSelected, onClick, isLoading }: TopicItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200",
        isSelected
          ? "bg-primary text-primary-foreground font-medium"
          : "text-foreground hover:bg-muted"
      )}
    >
      {isLoading ? (
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0" />
      ) : (
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
            isSelected ? "bg-primary-foreground" : "bg-muted-foreground"
          )}
        />
      )}
      <span className="flex-1 break-words text-left">{topic.topic}</span>
      <span
        className={cn(
          "text-xs flex-shrink-0",
          isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        {/* {topic.questionCount} this will be the number of questions in the topic*/}
        67
      </span>
    </button>
  );
}
