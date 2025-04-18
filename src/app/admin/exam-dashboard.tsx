"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { QuestionsTable } from "./questions-table"
import { QuestionForm } from "./question-form"

// Sample initial data
const initialQuestions = [
  {
    id: "1.3.13",
    question_id: "1.3.13",
    content:
      "A piece of gold has a mass of $760$ grams and a volume of $40 \\text{ cm}^3$.\n\n\\vspace{0.5cm} \n\n\\qquad Work out the density of the piece of gold.\n\n\\vspace{8cm} \n\n\\hfill \\makebox[4cm]{\\dotfill}",
    answer: "$19 \\,\\text{g/cm}^3$",
    total_marks: 3,
    topic: "Number",
    type: "calc",
    question_topic: "Compound Measures",
    question_description: "Work out the density of the piece of gold.",
    difficulty: "Grade 1-3",
    full_page: false,
    createdAt: { _seconds: 1744901326, _nanoseconds: 263000000 },
  },
]

export type Question = (typeof initialQuestions)[0]

export function ExamDashboard() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question)
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setSelectedQuestion(null)
  }

  const handleDelete = (questionId: string) => {
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
      setQuestions(questions.map((q) => (q.question_id === question.question_id ? question : q)))
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
          <QuestionsTable questions={questions} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
