"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Wand2 } from "lucide-react"
import type { Question } from "@/types/questionType"

type MaxMarksGeneratorProps = {
  questions: Question[]
  addSelectedQuestions: (questions: Question[]) => void
  activeFilters: {
    difficulty: string[]
    type: string[]
  }
}

export default function MaxMarksGenerator({
  questions,
  addSelectedQuestions,
  activeFilters,
}: MaxMarksGeneratorProps) {
  const [maxMarks, setMaxMarks] = useState<number>(50)
  const [balanceTopics, setBalanceTopics] = useState<boolean>(true)

  const generateRandomExam = () => {
    if (questions.length === 0) return

    // Apply active filters
    let filteredQuestions = [...questions]

    if (activeFilters.difficulty.length > 0) {
      filteredQuestions = filteredQuestions.filter((q) =>
        activeFilters.difficulty.includes(q.difficulty)
      )
    }

    if (activeFilters.type.length > 0) {
      filteredQuestions = filteredQuestions.filter((q) =>
        activeFilters.type.includes(q.type)
      )
    }

    if (filteredQuestions.length === 0) {
      alert("No questions match your current filters")
      return
    }

    // Group by topic if balancing is enabled
    if (balanceTopics) {
      const topicGroups: Record<string, Question[]> = {}

      filteredQuestions.forEach((q) => {
        if (!topicGroups[q.topic]) {
          topicGroups[q.topic] = []
        }
        topicGroups[q.topic].push(q)
      })

      // Shuffle each topic group
      Object.keys(topicGroups).forEach((topic) => {
        topicGroups[topic].sort(() => 0.5 - Math.random())
      })

      // Take questions from each topic in a round-robin fashion
      const selectedQuestions: Question[] = []
      let totalMarks = 0
      let continueSelecting = true

      while (continueSelecting) {
        continueSelecting = false

        for (const topic of Object.keys(topicGroups)) {
          if (topicGroups[topic].length > 0) {
            const question = topicGroups[topic].shift()!

            if (totalMarks + question.total_marks <= maxMarks) {
              selectedQuestions.push(question)
              totalMarks += question.total_marks
              continueSelecting = true
            } else {
              // Put the question back
              topicGroups[topic].unshift(question)
            }

            // If we're close enough to the target, stop
            if (maxMarks - totalMarks <= 3) {
              continueSelecting = false
              break
            }
          }
        }
      }

      addSelectedQuestions(selectedQuestions)
    } else {
      // Original random selection logic
      const shuffled = filteredQuestions.sort(() => 0.5 - Math.random())

      let totalMarks = 0
      const selectedQuestions: Question[] = []

      for (const question of shuffled) {
        if (totalMarks + question.total_marks <= maxMarks) {
          selectedQuestions.push(question)
          totalMarks += question.total_marks
        }

        if (maxMarks - totalMarks <= 3) break
      }

      addSelectedQuestions(selectedQuestions)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Random Exam Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max-marks">Maximum Marks</Label>
            <Input
              id="max-marks"
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              min={1}
              max={100}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="balance-topics"
              checked={balanceTopics}
              onCheckedChange={(checked) => setBalanceTopics(checked === true)}
            />
            <Label htmlFor="balance-topics">Balance topics evenly</Label>
          </div>

          <Button
            onClick={generateRandomExam}
            disabled={questions.length === 0}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Random Exam
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
