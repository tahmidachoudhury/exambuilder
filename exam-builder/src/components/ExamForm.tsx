"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
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

const formSchema = z.object({
  numberOfQuestions: z.number().min(1).max(100),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  answerSheet: z.boolean(),
  topics: z.array(z.string()).min(1),
})

const topics = [
  { label: "Algebra", value: "algebra" },
  { label: "Geometry", value: "geometry" },
  { label: "Trigonometry", value: "trigonometry" },
  { label: "Calculus", value: "calculus" },
  { label: "Statistics", value: "statistics" },
  { label: "Probability", value: "probability" },
]

export default function ExamForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfQuestions: 10,
      difficultyLevel: "medium",
      answerSheet: true,
      topics: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Here you would typically send the form data to your backend
    fetch("http://localhost:3001/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell the server the payload is JSON
      },
      body: JSON.stringify({ values }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data)
      })
      .catch((error) => {
        console.error("Error:", error)
      })
    console.log(values)
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Exam created successfully!")
      form.reset()
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="numberOfQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value, 10))
                  }
                />
              </FormControl>
              <FormDescription>
                Enter the number of questions for the exam (1-100).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficultyLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
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
          name="answerSheet"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Answer Sheet</FormLabel>
                <FormDescription>
                  Do you need an answer sheet for this exam?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Exam"}
        </Button>
      </form>
    </Form>
  )
}
