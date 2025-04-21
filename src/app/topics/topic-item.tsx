import { ArrowUpRight } from "lucide-react"

interface TopicItemProps {
  topic: string
  categoryId: number
  index: number
}

export default function TopicItem({
  topic,
  categoryId,
  index,
}: TopicItemProps) {
  // Convert the topic to a URL-friendly format
  const topicSlug = topic
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
  const url = `https://mathsgenie.co.uk/${topicSlug}.php`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-baseline">
        <span className="text-gray-500 w-12 font-mono">
          {categoryId}.{index}
        </span>
        <span className="font-medium">{topic}</span>
      </div>
      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
    </a>
  )
}
