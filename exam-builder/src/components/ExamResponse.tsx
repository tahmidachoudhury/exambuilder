import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MathJaxContext, MathJax } from "better-react-mathjax"

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

const defaultQuestions = [
  {
    id: 1,
    text: "Solve the equation:",
    math: "3(x - 2) = 2x + 4",
  },
  {
    id: 2,
    text: "Simplify the expression:",
    math: "(2x + 3)(x - 4) - 5x^2",
  },
  {
    id: 3,
    text: "Factorize the quadratic expression:",
    math: "x^2 - 5x - 24",
  },
  {
    id: 4,
    text: "Solve the simultaneous equations:",
    math: `
      \\begin{aligned}
      3x + 2y &= 12 \\\\
      2x - y &= 3
      \\end{aligned}
    `,
  },
  {
    id: 5,
    text: "Find the value of \\(x\\) in the equation:",
    math: "\\frac{2x - 3}{4} = \\frac{x + 5}{3}",
  },
  {
    id: 6,
    text: "If the sequence is defined by \\(a_n = 3n^2 + 2n\\), find the value of the 5th term in the sequence.",
    math: "",
  },
]

const defaultAnswers = [
  { id: 1, math: "x = 10" },
  { id: 2, math: "-3x^2 - 5x + 12" },
  { id: 3, math: "(x - 8)(x + 3)" },
  { id: 4, math: "x = 3, \\; y = \\frac{3}{2}" },
  { id: 5, math: "x = 13" },
  { id: 6, math: "a_5 = 85" },
]

export function ExamResponse({ message, item, questions }: ExamResponseProps) {
  const AIQuestionsAndAnswers =
    typeof questions === "string"
      ? JSON.parse(questions)
      : { questions: defaultQuestions, answers: defaultAnswers }

  const allQuestions = AIQuestionsAndAnswers.questions
  const allAnswers = AIQuestionsAndAnswers.answers

  return (
    // <Card className="mt-8">
    //   <CardHeader>
    //     <CardTitle>Exam Question Created</CardTitle>
    //     <CardDescription>{message}</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <div className="space-y-4">
    //       <div>
    //         <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>
    //         <ul className="space-y-2">
    //           {questions || "we seem to have ran into an error"}
    //         </ul>
    //       </div>
    //     </div>
    //   </CardContent>
    // </Card>
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
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Questions</h1>
        <ul className="list-decimal ml-6 space-y-4">
          {allQuestions.map((question: any) => (
            <li key={`question-${question.id}-${Math.random()}`}>
              <MathJax>{question.text}</MathJax>
              {question.math && (
                <MathJax>
                  <div>${question.math}$</div>
                </MathJax>
              )}
            </li>
          ))}
        </ul>

        <h1 className="text-xl font-bold mt-8 mb-4">Answers</h1>
        <ul className="list-decimal ml-6 space-y-4">
          {allAnswers.map((answer: any) => (
            <li key={`answer-${answer.id}-${Math.random()}`}>
              {answer.math && (
                <MathJax>
                  <div>${answer.math}$</div>
                </MathJax>
              )}
            </li>
          ))}
        </ul>
      </div>
    </MathJaxContext>
  )
}
