"use client"

import { useEffect, useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { QuestionsTable } from "./questions-table"
import { QuestionForm } from "./question-form"
import { Question } from "@/components/UserForm"
import { useToast } from "@/hooks/use-toast"

export function ExamDashboard() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  )
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    // retreive the questions from the firebase backend
    const apiUrl = process.env.NEXT_PUBLIC_RETRIEVE_QUESTIONS_BACKEND_API_KEY
    // const apiUrl = "http://localhost:3002/api/test"
    if (!apiUrl) {
      throw new Error(
        "Backend API URL is not configured. Please check your environment variables."
      )
    }
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Tell the server the payload is JSON
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const { questions } = data

        setQuestions(questions)
      })
      .catch((error) => {
        console.error("Error:", error)
        console.log("Check the server mate")
      })
  }, [])

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question)
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setSelectedQuestion(null)
  }

  const handleDelete = (questionId: string) => {
    toast({
      title: "Are you sure?",
      description: "This will permanently delete the question.",
    })
    setQuestions(questions.filter((q) => q.question_id !== questionId))
    if (selectedQuestion?.question_id === questionId) {
      setSelectedQuestion(null)
    }
  }

  const handleSave = (question: Question) => {
    if (isCreating) {
      setQuestions([...questions, question])
      setIsCreating(false)
    } else {
      setQuestions(
        questions.map((q) =>
          q.question_id === question.question_id ? question : q
        )
      )
    }
    setSelectedQuestion(null)
  }

  const handleCancel = () => {
    setSelectedQuestion(null)
    setIsCreating(false)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Exam Builder Dashboard</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {selectedQuestion || isCreating ? (
          <QuestionForm
            question={selectedQuestion}
            isCreating={isCreating}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <QuestionsTable
            questions={questions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}
