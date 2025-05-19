"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  ChevronRight,
  ChevronDown,
  Calculator,
  Ban,
} from "lucide-react"
import type { Question } from "@/types/questionType"

type SelectedQuestionsMinimalProps = {
  questions?: Question[]
  onRemoveQuestion?: (questionId: string) => void
  loading?: boolean
}

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Grade 1-3":
      return "bg-green-100 text-green-800 border-green-200"
    case "Grade 4-5":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Grade 6-7":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "Grade 8-9":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function SelectedQuestionsMinimal({
  questions,
  onRemoveQuestion = (id) => console.log(`Remove question ${id}`),
  loading = false,
}: SelectedQuestionsMinimalProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])

  const toggleExpand = (questionId: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    )
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.total_marks, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Selected Questions</CardTitle>
          {questions.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {totalMarks} marks
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No questions selected yet
          </div>
        ) : (
          <ul className="space-y-2">
            {questions.map((question, index) => (
              <li key={question.question_id}>
                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center p-3 bg-muted/20">
                    <button
                      onClick={() => toggleExpand(question.question_id)}
                      className="mr-2 focus:outline-none"
                      aria-label={
                        expandedQuestions.includes(question.question_id)
                          ? "Collapse question"
                          : "Expand question"
                      }
                    >
                      {expandedQuestions.includes(question.question_id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{index + 1}.</span>
                        <span className="text-sm font-medium truncate">
                          {question.question_id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(
                          question.difficulty
                        )}`}
                        title={question.difficulty}
                      >
                        {question.difficulty.replace("Grade ", "G")}
                      </div>

                      <div
                        title={
                          question.type === "calc"
                            ? "Calculator"
                            : "Non-Calculator"
                        }
                      >
                        {question.type === "calc" ? (
                          <Calculator className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </div>

                      <Badge variant="secondary" className="text-xs">
                        [{question.total_marks}]
                      </Badge>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => onRemoveQuestion(question.question_id)}
                        title="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {expandedQuestions.includes(question.question_id) && (
                    <div className="p-3 border-t">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{question.topic}</Badge>
                        <Badge
                          variant="outline"
                          className="truncate max-w-[200px]"
                        >
                          {question.question_topic}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">
                        {question.question_description}
                      </p>
                      <div className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: question.content
                              .replace(/\$/g, "$$")
                              .replace(/\$/g, "$$"),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
