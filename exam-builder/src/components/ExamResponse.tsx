import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Question {
  id?: string
  text?: string
  difficulty?: string
  topic?: string
}

interface ExamResponseProps {
  message?: string
  item?: {
    numberOfQuestions: number
    difficultyLevel: string
    answerSheet: boolean
    topics: string[]
  }
  questions?: Question[]
}

export function ExamResponse({ message, item, questions }: ExamResponseProps) {
  console.log("item", item?.topics)
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Exam Question Created</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>
            <ul className="space-y-2">
              {questions || "we seem to have ran into an error"}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
