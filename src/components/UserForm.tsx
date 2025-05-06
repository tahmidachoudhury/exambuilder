"use client"

import { useEffect, useMemo, useState } from "react"
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

import { TopicSelect } from "./ui/topic-select"
import { Loader2 } from "lucide-react"
import { QuestionSelector } from "./QuestionSelector"
import { DiffSelect } from "./ui/diff-select"

const formSchema = z.object({
  difficultyLevel: z.array(z.string()),
  topics: z.array(z.string()),
  paperType: z.enum(["calc", "non-calc", "mixed"]),
  questions: z.array(z.string()).min(1),
})

export default function UserForm() {
  const [backendQuestions, setBackendQuestions] = useState<Question[]>([])

  // const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [finalQuestions, setFinalQuestions] = useState<Question[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string[]>([])
  const [selectedPaperType, setSelectedPaperType] = useState("")

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficultyLevel: [],
      topics: [],
      paperType: "mixed",
      questions: [],
    },
  })

  useEffect(() => {
    fetchQuestions() // first page
  }, [])

  const fetchQuestions = async (cursor?: string) => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    try {
      const url = cursor
        ? `/api/get-questions?limit=100&startAfter=${cursor}`
        : `/api/get-questions?limit=100`

      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok || !Array.isArray(data.questions)) {
        throw new Error("Failed to fetch questions")
      }

      setBackendQuestions((prev) => [...prev, ...data.questions])
      // setNextCursor(data.nextCursor)
      if (!data.nextCursor) setHasMore(false)
    } catch (err) {
      console.error("🔥 Infinite scroll error:", err)
      setHasMore(false)
    }

    setIsLoading(false)
  }

  const filteredQuestions = useMemo(() => {
    return backendQuestions.filter(
      (q: Question) =>
        (selectedTopic.length > 0 ? selectedTopic.includes(q.topic) : true) &&
        (selectedDifficulty.length > 0
          ? selectedDifficulty.includes(q.difficulty)
          : true) &&
        (selectedPaperType ? q.type === selectedPaperType : true)
    )
  }, [backendQuestions, selectedTopic, selectedDifficulty, selectedPaperType])

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
                <DiffSelect
                  selected={field.value}
                  onChange={(chosenDiff) => {
                    field.onChange(chosenDiff)

                    setSelectedDifficulty(chosenDiff)
                  }}
                  placeholder="Select Difficulty"
                />

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
                  <TopicSelect
                    selected={field.value}
                    onChange={(chosenTopics) => {
                      field.onChange(chosenTopics)

                      setSelectedTopic(chosenTopics)
                    }}
                    placeholder="Select topics"
                  />
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
                      setSelectedPaperType(value)
                    } else {
                      setSelectedPaperType("")
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
                      setFinalQuestions(selectedQuestions)
                    }}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
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
