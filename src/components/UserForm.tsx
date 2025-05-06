"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Question } from "@/types/questionType"
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
import { truncate } from "@/app/admin/questions-table"
import { QuestionSelector } from "./QuestionSelector"

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

  //retrieve db questions securely through firebase admin with limits
  useEffect(() => {
    const fetchFilteredQuestions = async () => {
      try {
        const res = await fetch(`/api/getQuestions?limit=20`)

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Server error: ${res.status} - ${errorText}`)
        }

        const { questions } = await res.json()

        if (!questions || !Array.isArray(questions)) {
          throw new Error("Invalid response format from server")
        }

        setBackendQuestions(questions)
      } catch (error) {
        console.error("Error fetching filtered questions:", error)
      }
    }

    fetchFilteredQuestions()
  }, [])

  async function generateExam() {
    setIsSubmitting(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_GENERATE_EXAM_ENDPOINT_URL
      // const apiUrl = "http://localhost:3002/api/generate-exam"
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
                  <QuestionSelector
                    questions={backendQuestions}
                    filteredQuestions={filteredQuestions}
                    selectedValues={field.value}
                    onSelectedValuesChange={field.onChange}
                    onSelect={(selectedQuestions) => {
                      console.log(selectedQuestions)
                      setFinalQuestions(selectedQuestions)
                    }}
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
