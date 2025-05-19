"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Printer } from "lucide-react"
import type { Question } from "@/types/questionType"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

type ExamSummaryProps = {
  selectedQuestions: Question[]
}

export default function ExamSummary({ selectedQuestions }: ExamSummaryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalMarks = selectedQuestions.reduce(
    (sum, question) => sum + question.total_marks,
    0
  )

  const difficultyBreakdown = selectedQuestions.reduce((acc, question) => {
    acc[question.difficulty] = (acc[question.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topicBreakdown = selectedQuestions.reduce((acc, question) => {
    acc[question.topic] = (acc[question.topic] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeBreakdown = selectedQuestions.reduce((acc, question) => {
    acc[question.type] = (acc[question.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  async function generateExam() {
    setIsSubmitting(true)

    try {
      // const apiUrl = process.env.NEXT_PUBLIC_GENERATE_EXAM_ENDPOINT_URL
      const apiUrl = "http://localhost:3002/api/generate-exam"
      if (!apiUrl) {
        throw new Error(
          "Backend API URL is not configured. Please check your environment variables."
        )
      }
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          //added headers to control cache when downloading
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify(selectedQuestions), // Send the selected exam questions to the backend
      })
      if (!response.ok) throw new Error("ZIP generation failed")
      console.log(response)

      // Get ZIP blob from response
      const zipBlob = await response.blob()

      // Create download link
      const downloadUrl = window.URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `exam-${Date.now()}.zip` // Timestamped ZIP filename
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error:", error)
      // Show error to user
    } finally {
      setIsSubmitting(false)
      toast({
        title: "Download complete 🎉",
        description: "Please check your downloads for a .zip folder",
        variant: "success",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Summary</CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          generateExam()
        }}
        className="space-y-8"
      >
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">
                Total Questions: {selectedQuestions.length}
              </h3>
              <p className="text-2xl font-bold">Total Marks: {totalMarks}</p>
            </div>

            {selectedQuestions.length > 0 && (
              <>
                <div className="space-y-2">
                  <h3 className="font-medium">Difficulty Breakdown:</h3>
                  <ul className="space-y-1">
                    {Object.entries(difficultyBreakdown).map(
                      ([difficulty, count]) => (
                        <li
                          key={difficulty}
                          className="text-sm flex justify-between"
                        >
                          <span>{difficulty}:</span>
                          <span>{count} questions</span>
                        </li>
                      )
                    )}
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
                        <span>
                          {type === "non-calc"
                            ? "Non-Calculator"
                            : "Calculator"}
                          :
                        </span>
                        <span>{count} questions</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
