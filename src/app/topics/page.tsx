import TopicList from "./topic-list"
import { topics } from "@/lib/topics"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">GCSE Maths Topics</h1>
      <p className="text-center mb-8 text-primary-foreground">
        Click on any topic to view its content on MathsGenie
      </p>

      <div className="max-w-4xl mx-auto">
        <TopicList topics={topics} />
      </div>
    </main>
  )
}
