"use client"

import { useEffect, useState } from "react"
import { set, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
import { DropdownMenuCheckboxes } from "./ui/Checkbox"

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
  questions: z.array(z.string()),
})

interface Question {
  question_id: string
  topic: string
  question_topic: string
  question_description: string
  difficulty: string
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
  const [backendQuestions, setBackendQuestions] = useState<any[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([])
  const [finalQuestions, setFinalQuestions] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficultyLevel: "all-levels",
      topics: [],
      questions: [],
    },
  })

  useEffect(() => {
    // Here you would typically send the form data to your backend
    fetch("http://localhost:3002/api/test", {
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
    try {
      // Send request to backend
      const response = await fetch("http://localhost:3002/api/generate-exam", {
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

      if (!response.ok) throw new Error("PDF generation failed")

      // Create blob from the PDF data
      const blob = await response.blob()

      // Create download link and trigger download
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `exam-${Date.now()}.pdf` // Add timestamp to filename
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error:", error)
      // Show error to user
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
                    <DropdownMenuCheckboxes
                      selected={field.value}
                      onChange={() => {
                        console.log(field.value)
                      }}
                      backendQuestions={backendQuestions}
                    />
                  )}

                  {/* <MultiSelect
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
                  /> */}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Exam"}
          </Button>
        </form>
      </Form>
    </>
  )
}
