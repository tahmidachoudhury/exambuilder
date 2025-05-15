"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2 } from "lucide-react"
import type { Question } from "./ExamBuilder"

type QuestionListProps = {
  questions: Question[]
  loading: boolean
  onAddQuestion: (question: Question) => void
  selectedQuestionIds: string[]
  loadMore: () => void
  hasMore: boolean
}

export default function QuestionList({
  questions,
  loading,
  onAddQuestion,
  selectedQuestionIds,
  loadMore,
  hasMore,
}: QuestionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Select a topic to view questions or no questions match your filters
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.question_id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Question {question.question_id}</h3>
                    <p className="text-sm text-muted-foreground">{question.question_description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddQuestion(question)}
                    disabled={selectedQuestionIds.includes(question.question_id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{question.topic}</Badge>
                  <Badge variant="outline">{question.question_topic}</Badge>
                  <Badge>{question.difficulty}</Badge>
                  <Badge variant="secondary">{question.type === "non-calc" ? "Non-Calculator" : "Calculator"}</Badge>
                  <Badge variant="secondary">
                    {question.total_marks} {question.total_marks === 1 ? "mark" : "marks"}
                  </Badge>
                </div>

                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <div
                    dangerouslySetInnerHTML={{ __html: question.content.replace(/\$/g, "$$").replace(/\$/g, "$$") }}
                  />
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button onClick={loadMore} variant="outline">
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
