"use client"

import type React from "react"

import { useState } from "react"
import { Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Question } from "@/components/UserForm"

interface QuestionFormProps {
  question: Question | null
  isCreating: boolean
  onSave: (question: Question) => void
  onCancel: () => void
}

export function QuestionForm({
  question,
  isCreating,
  onSave,
  onCancel,
}: QuestionFormProps) {
  const [formData, setFormData] = useState<Question>(
    question || {
      question_id: "",
      content: "",
      answer: "",
      total_marks: 0,
      topic: "",
      type: "",
      question_topic: "",
      question_description: "",
      difficulty: "",
      full_page: false,
    }
  )

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: Number.parseInt(value) || 0 })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({ ...formData, [name]: checked })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isCreating ? "Create New Question" : "Edit Question"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Question Content</TabsTrigger>
              <TabsTrigger value="answer">Answer</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="question_id">Question ID</Label>
                  <Input
                    id="question_id"
                    name="question_id"
                    value={formData.question_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_marks">Total Marks</Label>
                  <Input
                    id="total_marks"
                    name="total_marks"
                    type="number"
                    value={formData.total_marks}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Main Topic</Label>
                  <Select
                    value={formData.topic}
                    onValueChange={(value) =>
                      handleSelectChange("topic", value)
                    }
                  >
                    <SelectTrigger id="topic">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Number">Number</SelectItem>
                      <SelectItem value="Algebra">Algebra</SelectItem>
                      <SelectItem value="Geometry">Geometry</SelectItem>
                      <SelectItem value="RPR">RPR</SelectItem>
                      <SelectItem value="Statistics">Statistics</SelectItem>
                      <SelectItem value="Probability">Probability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question_topic">Specific Topic</Label>
                  <Input
                    id="question_topic"
                    name="question_topic"
                    value={formData.question_topic}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Question Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calc">Calculator</SelectItem>
                      <SelectItem value="non-calc">Non-Calculator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      handleSelectChange("difficulty", value)
                    }
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 1-3">Grade 1-3</SelectItem>
                      <SelectItem value="Grade 4-5">Grade 4-5</SelectItem>
                      <SelectItem value="Grade 6-7">Grade 6-7</SelectItem>
                      <SelectItem value="Grade 8-9">Grade 8-9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question_description">Description</Label>
                  <Input
                    id="question_description"
                    name="question_description"
                    value={formData.question_description}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="full_page"
                    name="full_page"
                    checked={formData.full_page}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="full_page">Full Page Question</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <div className="space-y-2">
                <Label htmlFor="content">Question Content (LaTeX)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="min-h-[400px] font-mono"
                  placeholder="Enter question content with LaTeX formatting..."
                />
              </div>
            </TabsContent>

            <TabsContent value="answer">
              <div className="space-y-2">
                <Label htmlFor="answer">Answer (LaTeX)</Label>
                <Textarea
                  id="answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  className="min-h-[400px] font-mono"
                  placeholder="Enter answer with LaTeX formatting..."
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Question Preview</h3>
                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                    <div className="whitespace-pre-wrap font-serif">
                      {formData.content}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Answer Preview</h3>
                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                    <div className="whitespace-pre-wrap font-serif">
                      {formData.answer}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Question ID
                    </h3>
                    <p>{formData.question_id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Marks</h3>
                    <p>{formData.total_marks}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Topic</h3>
                    <p>
                      {formData.topic} - {formData.question_topic}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Difficulty
                    </h3>
                    <p>{formData.difficulty}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p>{formData.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Full Page
                    </h3>
                    <p>{formData.full_page ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Question
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
