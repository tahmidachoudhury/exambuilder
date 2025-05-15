"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, MoveUp, MoveDown } from "lucide-react"
import type { Question } from "./ExamBuilder"
import { useState } from "react"
import { MathJaxContext, MathJax } from "better-react-mathjax"

type SelectedQuestionsProps = {
  questions: Question[]
  onRemoveQuestion: (questionId: string) => void
}

export default function SelectedQuestions({
  questions,
  onRemoveQuestion,
}: SelectedQuestionsProps) {
  const [reordering, setReordering] = useState(false)

  // This would be implemented if you want to add reordering functionality
  const toggleReordering = () => {
    setReordering(!reordering)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Selected Questions</CardTitle>
        {questions.length > 0 && (
          <Button variant="outline" size="sm" onClick={toggleReordering}>
            {reordering ? "Done" : "Reorder"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No questions selected yet
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.question_id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      Question {index + 1} (ID: {question.question_id})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {question.question_description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {reordering && (
                      <>
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={index === questions.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onRemoveQuestion(question.question_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                  <MathJaxContext
                    config={{
                      tex: {
                        inlineMath: [
                          ["$", "$"],
                          ["\\(", "\\)"],
                        ],
                        displayMath: [
                          ["$$", "$$"],
                          ["\\[", "\\]"],
                        ],
                      },
                      loader: { load: ["input/tex", "output/chtml"] },
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: question.content
                          .replace(/\$/g, "$$")
                          .replace(/\$/g, "$$"),
                      }}
                    />
                  </MathJaxContext>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
