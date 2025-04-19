"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Question } from "@/types/questionType"

interface QuestionPreviewProps {
  question: Question
}

export function QuestionPreview({ question }: QuestionPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              Question {question.question_id}
            </h3>
            <div className="mt-2 whitespace-pre-wrap">{question.content}</div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Answer</h3>
            <div className="mt-2 whitespace-pre-wrap">{question.answer}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
