"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import type { Question } from "./ExamBuilder"
import { useState } from "react"
import QuestionSkeleton from "./QuestionSkeleton"

type QuestionListProps = {
  questions: Question[]
  loading: boolean
  onAddQuestion: (question: Question) => void
  selectedQuestionIds: string[]
  handleNext: () => void
  handlePrev: () => void
  hasMore: boolean
  firstPage: boolean
}

export default function QuestionList({
  questions,
  loading,
  onAddQuestion,
  selectedQuestionIds,
  handleNext,
  handlePrev,
  hasMore,
  firstPage,
}: QuestionListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Available Questions</CardTitle>
        {
          <div className="flex flex-row items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handlePrev}
              disabled={firstPage}
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleNext}
              disabled={!hasMore}
            >
              <ArrowRight />
            </Button>
          </div>
        }
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <QuestionSkeleton key={index} />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Select a topic to view questions or no questions match your filters
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.question_id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      Question {question.question_id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {question.question_description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddQuestion(question)}
                    disabled={selectedQuestionIds.includes(
                      question.question_id
                    )}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{question.topic}</Badge>
                  <Badge variant="outline">{question.question_topic}</Badge>
                  <Badge>{question.difficulty}</Badge>
                  <Badge variant="secondary">
                    {question.type === "non-calc"
                      ? "Non-Calculator"
                      : "Calculator"}
                  </Badge>
                  <Badge variant="secondary">
                    {question.total_marks}{" "}
                    {question.total_marks === 1 ? "mark" : "marks"}
                  </Badge>
                </div>

                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: question.content
                        .replace(/\$/g, "$$")
                        .replace(/\$/g, "$$"),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
