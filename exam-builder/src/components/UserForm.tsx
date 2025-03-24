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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MultiSelect } from "@/components/ui/multi-select"
import { ExamResponse } from "./ExamResponse"

const formSchema = z.object({
  numberOfQuestions: z.number().min(1).max(10),
  difficultyLevel: z.enum(["easy", "medium", "hard", "hardest"]),
  answerSheet: z.boolean(),
  topics: z.array(z.string()).min(1),
})

interface Question {
  question_id: string
  question_topic: string
  question_description: string
  difficulty: string
}

const topics = [
  { label: "Number", value: "number" },
  { label: "Algebra", value: "algebra" },
  { label: "Geometry", value: "geometry" },
  {
    label: "Ratio, Proportion and Rates of Change",
    value: "ratio-proportion-and-rates-of-change",
  },
  { label: "Statistics", value: "statistics" },
  { label: "Probability", value: "probability" },
]

export default function UserForm() {
  const [backendQuestions, setBackendQuestions] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfQuestions: 1,
      difficultyLevel: "medium",
      answerSheet: true,
      topics: [],
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
        console.log(data)
        const {
          tempQuestions: { questions },
        } = data
        console.log(questions)
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Grade 1-3</SelectItem>
                    <SelectItem value="medium">Grade 4-5</SelectItem>
                    <SelectItem value="hard">Grade 6-7</SelectItem>
                    <SelectItem value="hardest">Grade 8-9</SelectItem>
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
                  <MultiSelect
                    options={topics}
                    selected={field.value}
                    onChange={field.onChange}
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
            name="topics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Questions</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={backendQuestions.map((question: Question) => ({
                      label: `${question.question_id}: ${question.question_topic}`,
                      value: question.question_id,
                      desc: question.question_description,
                    }))}
                    selected={field.value}
                    onChange={field.onChange}
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
