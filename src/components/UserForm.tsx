"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { MultiSelect } from "@/components/ui/multi-select"
import { TopicSelect } from "./ui/topic-select"
import { Loader2 } from "lucide-react"
import { ToastAction } from "./ui/toast"

const difficultyOptions = [
  "Grade 1-3",
  "Grade 4-5",
  "Grade 6-7",
  "Grade 8-9",
  "all-levels",
] as const

const difficulties = difficultyOptions.slice(0, -1)

const formSchema = z.object({
  difficultyLevel: z.enum(difficultyOptions),
  topics: z.array(z.string()),
  paperType: z.enum(["calc", "non-calc", "mixed"]),
  questions: z.array(z.string()).min(1),
})

export type Question = {
  question_id: string
  content: string
  answer: string
  total_marks: number
  topic: string
  type: string
  question_topic: string
  question_description: string
  difficulty: string
  full_page: boolean
}

const topics = [
  { label: "Number", value: "Number" },
  { label: "Algebra", value: "Algebra" },
  { label: "Geometry", value: "Geometry" },
  {
    label: "Ratio, Proportion and Rates of Change",
    value: "RPR",
  },
  { label: "Statistics", value: "Statistics" },
  { label: "Probability", value: "Probability" },
]

export default function UserForm() {
  const [backendQuestions, setBackendQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [finalQuestions, setFinalQuestions] = useState<Question[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficultyLevel: "all-levels",
      topics: [],
      paperType: "mixed",
      questions: [],
    },
  })

  useEffect(() => {
    // retreive the questions from the backend, will change this to a Database fetch
    const apiUrl = process.env.NEXT_PUBLIC_RETRIEVE_QUESTIONS_BACKEND_API_KEY
    if (!apiUrl) {
      throw new Error(
        "Backend API URL is not configured. Please check your environment variables."
      )
    }
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Tell the server the payload is JSON
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const {
          tempQuestions: { questions },
        } = data

        setBackendQuestions(questions)
      })
      .catch((error) => {
        console.error("Error:", error)
        console.log("Check the server mate")
      })
  }, [])

  async function generateExam() {
    setIsSubmitting(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_GENERATE_EXAM_BACKEND_API_KEY
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
        body: JSON.stringify(finalQuestions), // Send the filtered exam questions to the backend
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
      })
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(generateExam)} className="space-y-8">
          <FormField
            control={form.control}
            name="difficultyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    //filters questions based on chosen difficulty
                    //if all levels is picked then it will filter through backend questions hook
                    setFilteredQuestions([])
                    if (value !== "All levels") {
                      const newQuestions = backendQuestions.filter(
                        (q) => q.difficulty === value
                      )
                      setFilteredQuestions(newQuestions)
                    } else {
                      const newQuestions = backendQuestions.filter(
                        (q) => q.difficulty !== value
                      )
                      setFilteredQuestions(newQuestions)
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {difficulties.map((difficulty) => {
                      //checks if at least one question exists from the backend payload
                      const hasQuestions = backendQuestions.some(
                        (q) => q.difficulty === difficulty
                      )
                      return (
                        <SelectItem
                          key={difficulty}
                          value={difficulty}
                          disabled={!hasQuestions}
                        >
                          {difficulty}
                        </SelectItem>
                      )
                    })}
                    <SelectItem value="all-levels">All levels</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the difficulty level for the exam.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topics</FormLabel>
                <FormControl>
                  {backendQuestions.length > 0 && (
                    //a custom built variant of multiselect which allows for more prop handling
                    <TopicSelect
                      options={topics}
                      selected={field.value}
                      onChange={(chosenTopics) => {
                        field.onChange(chosenTopics)

                        const newTopics = backendQuestions.filter((question) =>
                          chosenTopics.includes(question.topic)
                        )
                        setFilteredQuestions(newTopics)
                      }}
                      placeholder="Select topics"
                      backendQuestions={backendQuestions}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  Select the topics to appear in the exam.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paperType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    //filters questions based on chosen difficulty
                    //if all levels is picked then it will filter through backend questions hook
                    if (value !== "mixed") {
                      const newQuestions = backendQuestions.filter(
                        (q) => q.type === value
                      )
                      setFilteredQuestions(newQuestions)
                    } else {
                      const newQuestions = backendQuestions.filter(
                        (q) => q.type !== value
                      )
                      setFilteredQuestions(newQuestions)
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Paper Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="calc">Calculator Only</SelectItem>
                    <SelectItem value="non-calc">
                      Non-Calculator Only
                    </SelectItem>
                    <SelectItem value="mixed">Mixed Questions</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose whether the paper is a Calculator or Non-Calculator
                  paper, or mixed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="questions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Questions</FormLabel>
                <FormControl>
                  <MultiSelect
                    //check if the user chose to filter any questions, if not then display all questions
                    options={(filteredQuestions.length > 0
                      ? filteredQuestions
                      : backendQuestions
                    ).map((question: Question) => ({
                      label: `${question.question_id}: ${question.question_topic}`,
                      value: question.question_id,
                      desc: question.question_description,
                    }))}
                    selected={field.value}
                    onChange={(chosenQuestions) => {
                      field.onChange(chosenQuestions)
                      const newQuestions = backendQuestions.filter((question) =>
                        chosenQuestions.includes(question.question_id)
                      )
                      console.log(newQuestions)
                      setFinalQuestions(newQuestions)
                    }}
                    placeholder="Select questions"
                  />
                </FormControl>
                <FormDescription>
                  Select the questions to appear in the exam.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            onClick={() => generateExam}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Exam"
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
