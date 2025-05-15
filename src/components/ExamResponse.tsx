import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Question {
  id: string
  text: string
  difficulty: string
  topic: string
}

interface ExamResponseProps {
  message: string
  item: {
    numberOfQuestions: number
    difficultyLevel: string
    answerSheet: boolean
    topics: string[]
  }
  questions: Question[]
}

export function ExamResponse({ message, item, questions }: ExamResponseProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Exam Created</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Exam Details:</h3>
            <p>Number of Questions: {item.numberOfQuestions}</p>
            <p>Difficulty Level: {item.difficultyLevel}</p>
            <p>Answer Sheet: {item.answerSheet ? "Yes" : "No"}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="font-semibold">Topics:</span>
              {item.topics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>
            <ul className="space-y-2">
              {questions.map((question) => (
                <li key={question.id} className="border rounded p-2">
                  <p>{question.text}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge>{question.difficulty}</Badge>
                    <Badge variant="outline">{question.topic}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
