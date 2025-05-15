"use client"

import { useState } from "react"
import TopicSelector from "./TopicSelector"
import FilterPanel from "./FilterPanel"
import QuestionList from "./QuestionList"
import SelectedQuestions from "./SelectedQuestions"
import ExamSummary from "./ExamSummary"
import MaxMarksGenerator from "./MaxMarksGenerator"
import FeedbackForm from "./FeedbackForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
export type Question = {
  question_id: string
  answer: string
  total_marks: number
  topic: string
  type: string
  question_topic: string
  difficulty: string
  full_page: boolean
  question_description: string
  content: string
}

export type TopicData = {
  id: number
  name: string
  topics: {
    topic: string
    url: string
  }[]
}

export default function ExamBuilder() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState({
    difficulty: [] as string[],
    type: [] as string[],
  })

  // Function to fetch questions based on topic
  const fetchQuestions = async (questionTopic: string) => {
    setLoading(true)
    try {
      const url = `/api/get-questions?limit=5&question_topic=${encodeURIComponent(
        questionTopic
      )}${cursor ? `&startAfter=${cursor}` : ""}`

      const response = await fetch(url)
      const data = await response.json()

      setQuestions(data.questions)
      setCursor(data.lastVisible || null)
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to add a question to the selected list
  const addQuestion = (question: Question) => {
    setSelectedQuestions((prev) => [...prev, question])
  }

  // Function to remove a question from the selected list
  const removeQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.filter((q) => q.question_id !== questionId)
    )
  }

  // Apply filters to questions
  const filteredQuestions = questions.filter((question) => {
    const difficultyMatch =
      activeFilters.difficulty.length === 0 ||
      activeFilters.difficulty.includes(question.difficulty)

    const typeMatch =
      activeFilters.type.length === 0 ||
      activeFilters.type.includes(question.type)

    return difficultyMatch && typeMatch
  })

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback: {
    category: string
    rating: number
    message: string
  }) => {
    console.log("Feedback submitted:", feedback)
    // Here you would typically send the feedback to your backend
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="space-y-6">
            <TopicSelector onSelectTopic={fetchQuestions} />
            <ExamSummary selectedQuestions={selectedQuestions} />
          </TabsContent>

          <TabsContent value="filters" className="space-y-6">
            <FilterPanel
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
            <MaxMarksGenerator
              questions={filteredQuestions}
              addSelectedQuestions={(qs) =>
                setSelectedQuestions((prev) => [...prev, ...qs])
              }
              activeFilters={activeFilters}
            />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackForm onFeedbackSubmit={handleFeedbackSubmit} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <QuestionList
          questions={filteredQuestions}
          loading={loading}
          onAddQuestion={addQuestion}
          selectedQuestionIds={selectedQuestions.map((q) => q.question_id)}
          loadMore={() => {
            if (cursor && questions.length > 0) {
              fetchQuestions(questions[0].question_topic)
            }
          }}
          hasMore={!!cursor}
        />

        <SelectedQuestions
          questions={selectedQuestions}
          onRemoveQuestion={removeQuestion}
        />
      </div>
    </div>
  )
}
