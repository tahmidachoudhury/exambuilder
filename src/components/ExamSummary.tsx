"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import type { Question } from "./ExamBuilder"

type ExamSummaryProps = {
  selectedQuestions: Question[]
}

export default function ExamSummary({ selectedQuestions }: ExamSummaryProps) {
  const totalMarks = selectedQuestions.reduce((sum, question) => sum + question.total_marks, 0)

  const difficultyBreakdown = selectedQuestions.reduce(
    (acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topicBreakdown = selectedQuestions.reduce(
    (acc, question) => {
      acc[question.topic] = (acc[question.topic] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeBreakdown = selectedQuestions.reduce(
    (acc, question) => {
      acc[question.type] = (acc[question.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Total Questions: {selectedQuestions.length}</h3>
            <p className="text-2xl font-bold">Total Marks: {totalMarks}</p>
          </div>

          {selectedQuestions.length > 0 && (
            <>
              <div className="space-y-2">
                <h3 className="font-medium">Difficulty Breakdown:</h3>
                <ul className="space-y-1">
                  {Object.entries(difficultyBreakdown).map(([difficulty, count]) => (
                    <li key={difficulty} className="text-sm flex justify-between">
                      <span>{difficulty}:</span>
                      <span>{count} questions</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Topic Breakdown:</h3>
                <ul className="space-y-1">
                  {Object.entries(topicBreakdown).map(([topic, count]) => (
                    <li key={topic} className="text-sm flex justify-between">
                      <span>{topic}:</span>
                      <span>{count} questions</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Paper Type Breakdown:</h3>
                <ul className="space-y-1">
                  {Object.entries(typeBreakdown).map(([type, count]) => (
                    <li key={type} className="text-sm flex justify-between">
                      <span>{type === "non-calc" ? "Non-Calculator" : "Calculator"}:</span>
                      <span>{count} questions</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button className="w-full">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Exam
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
