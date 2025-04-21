import type { TopicCategory } from "@/lib/topics"
import TopicItem from "./topic-item"

interface TopicListProps {
  topics: TopicCategory[]
}

export default function TopicList({ topics }: TopicListProps) {
  return (
    <div className="space-y-8">
      {topics.map((category) => (
        <div
          key={category.id}
          className="border rounded-lg overflow-hidden shadow-sm"
        >
          <div className="bg-gray-100 p-4 border-b">
            <h2 className="text-xl font-semibold">
              {category.id}. {category.name}
            </h2>
          </div>
          <div className="divide-y">
            {category.topics.map((topic, index) => (
              <TopicItem
                key={index}
                topic={topic}
                categoryId={category.id}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
