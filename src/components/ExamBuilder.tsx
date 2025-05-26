"use client"

import { useMemo, useState } from "react"
import TopicSelector from "./TopicSelector"
import FilterPanel from "./FilterPanel"
import QuestionList from "./QuestionList"
// import SelectedQuestions from "./SelectedQuestions"
import ExamSummary from "./ExamSummary"
import MaxMarksGenerator from "./MaxMarksGenerator"
import FeedbackForm from "./FeedbackForm"
import testQuestionsRaw from "../../backend/data/questions.json"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Question } from "@/types/questionType"
import SelectedQuestionsMinimal from "./SelectedQuestionsMinimal"

export type TopicData = {
  id: number
  name: string
  topics: {
    topic: string
    url: string
  }[]
}

const testQuestions = testQuestionsRaw.questions as Question[]

export default function ExamBuilder() {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const [loading, setLoading] = useState(false)
  const [pages, setPages] = useState<Array<Question[]>>([]) // array of pages (each is a list of questions)
  const [currentPage, setCurrentPage] = useState(0)
  const [cursor, setCursor] = useState<string | null>(null)

  const [activeFilters, setActiveFilters] = useState({
    difficulty: [] as string[],
    type: [] as string[],
  })

  // Function to fetch questions based on topic
  const fetchQuestions = async (questionTopic: string) => {
    setLoading(true)
    try {
      const currentCursor = cursorHistory[currentPage]
      const url = `/api/get-questions?limit=5&question_topic=${encodeURIComponent(
        questionTopic
      )}${currentCursor ? `&startAfter=${currentCursor}` : ""}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.questions && data.questions.length > 0) {
        // Add new page and update cursor state
        setPages((prev) => [...prev, data.questions])
        setCursorHistory((prev) => [...prev, data.nextCursor])
        setCursor(data.nextCursor)
        if (currentPage > 0) {
          setCurrentPage((prev) => prev + 1)
        }
        console.log(data.questions)
      } else {
        // Handle case where no questions were returned
        setCursor(null)
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to paginate to the next set of questions in memory
  async function handleNext() {
    console.log("Page before next:", currentPage)

    if (currentPage < pages.length - 1) {
      // fetch in memory by going forward
      setCurrentPage(currentPage + 1)
    } else if (cursor) {
      console.log(currentPage)
      await fetchQuestions(pages[currentPage][0].question_topic) // fetch next page
      setCurrentPage(currentPage + 1)
    }
  }

  //function to paginate backwards in memory
  function handlePrev() {
    console.log("Page before prev:", currentPage)

    if (currentPage > 0) {
      // Go backward in memory
      setCurrentPage(currentPage - 1)

      // Update cursor to the previous position if we're going back from the last page
      if (currentPage === pages.length - 1) {
        setCursor(cursorHistory[cursorHistory.length - 2])
      }
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
  const filteredQuestions = useMemo(() => {
    if (!pages[currentPage]) return []

    return pages[currentPage].filter((question) => {
      const difficultyMatch =
        activeFilters.difficulty.length === 0 ||
        activeFilters.difficulty.includes(question.difficulty)

      const typeMatch =
        activeFilters.type.length === 0 ||
        activeFilters.type.includes(question.type)

      return difficultyMatch && typeMatch
    })
  }, [pages, currentPage, activeFilters.difficulty, activeFilters.type])

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback: {
    category: string
    rating: number
    message: string
  }) => {
    console.log("Feedback submitted:", feedback)
    // Here you would typically send the feedback to your backend
  }

  function handleTopicSelection(topic: string) {
    setPages([])
    setCursorHistory([])
    setCursor(null)
    setCurrentPage(0)
    fetchQuestions(topic) // pass isnewtopic as a paramter
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
            <TopicSelector onSelectTopic={handleTopicSelection} />
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
          // questions={filteredQuestions}
          questions={testQuestions}
          loading={loading}
          onAddQuestion={addQuestion}
          selectedQuestionIds={selectedQuestions.map((q) => q.question_id)}
          handleNext={handleNext}
          handlePrev={handlePrev}
          firstPage={!currentPage}
          hasMore={!!cursor}
        />

        {/* <SelectedQuestions
          questions={selectedQuestions}
          onRemoveQuestion={removeQuestion}
        /> */}
        <SelectedQuestionsMinimal
          questions={selectedQuestions}
          onRemoveQuestion={removeQuestion}
        />
      </div>
    </div>
  )
}
