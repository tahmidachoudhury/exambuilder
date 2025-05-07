"use client"

import type React from "react"

import { ArrowDown, ArrowUp, Edit, Eye, Search, Trash2, X } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Question } from "@/types/questionType"

interface QuestionsTableProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (questionId: string) => void
}

type SortField = "question_id" | "createdAt" | "topic" | "type" | "difficulty"
type SortDirection = "asc" | "desc"

// Helper function to compare question IDs numerically (e.g., 1.1.9 comes before 1.1.10)
const compareQuestionIds = (a: string, b: string): number => {
  const segmentsA = a.split(".").map(Number)
  const segmentsB = b.split(".").map(Number)

  // Compare each segment
  for (let i = 0; i < Math.max(segmentsA.length, segmentsB.length); i++) {
    // If segment doesn't exist, treat as 0
    const segA = i < segmentsA.length ? segmentsA[i] : 0
    const segB = i < segmentsB.length ? segmentsB[i] : 0

    if (segA !== segB) {
      return segA - segB
    }
  }

  return 0 // IDs are equal
}

//long descriptions truncated for better UX
export const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max) + "..." : str

export function QuestionsTable({
  questions,
  onEdit,
  onDelete,
}: QuestionsTableProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  )
  const [sortField, setSortField] = useState<SortField>("question_id")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [topicFilter, setTopicFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("")

  // Derived unique filter options
  const [uniqueTopics, setUniqueTopics] = useState<string[]>([])
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([])
  const [uniqueDifficulties, setUniqueDistinctDifficulties] = useState<
    string[]
  >([])

  // Extract unique filter options from questions
  useEffect(() => {
    setUniqueTopics([...new Set(questions.map((q) => q.topic).filter(Boolean))])
    setUniqueTypes([...new Set(questions.map((q) => q.type).filter(Boolean))])
    setUniqueDistinctDifficulties([
      ...new Set(questions.map((q) => q.difficulty).filter(Boolean)),
    ])
  }, [questions])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setTopicFilter("")
    setTypeFilter("")
    setDifficultyFilter("")
  }

  // Filter questions based on search query and filters
  const filteredQuestions = questions.filter((question) => {
    // Search query filter (case insensitive)
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      question.question_id.toLowerCase().includes(searchLower) ||
      question.question_description.toLowerCase().includes(searchLower)

    // Topic filter
    const matchesTopic = topicFilter === "" || question.topic === topicFilter

    // Type filter
    const matchesType = typeFilter === "" || question.type === typeFilter

    // Difficulty filter
    const matchesDifficulty =
      difficultyFilter === "" || question.difficulty === difficultyFilter

    return matchesSearch && matchesTopic && matchesType && matchesDifficulty
  })

  // Sort filtered questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1

    switch (sortField) {
      case "question_id":
        return compareQuestionIds(a.question_id, b.question_id) * direction
      case "createdAt":
        return (
          ((a.createdAt?._seconds || 0) - (b.createdAt?._seconds || 0)) *
          direction
        )
      case "topic":
        return a.topic.localeCompare(b.topic) * direction
      case "type":
        return a.type.localeCompare(b.type) * direction
      case "difficulty":
        return a.difficulty.localeCompare(b.difficulty) * direction
      default:
        return 0
    }
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null

    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    )
  }

  const SortableHeader = ({
    field,
    children,
    className = "",
  }: {
    field: SortField
    children: React.ReactNode
    className?: string
  }) => (
    <TableHead
      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon field={field} />
      </div>
    </TableHead>
  )

  // Count active filters
  const activeFilterCount = [
    searchQuery !== "",
    topicFilter !== "",
    typeFilter !== "",
    difficultyFilter !== "",
  ].filter(Boolean).length

  return (
    <>
      <div className="space-y-4">
        {/* Search and filter section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                placeholder="Search by ID or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="topic-filter" className="text-sm font-medium">
                Topic
              </label>
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger id="topic-filter">
                  <SelectValue placeholder="All topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {uniqueTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="type-filter" className="text-sm font-medium">
                Type
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="difficulty-filter"
                className="text-sm font-medium"
              >
                Difficulty
              </label>
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger id="difficulty-filter">
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All difficulties</SelectItem>
                  {uniqueDifficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="shrink-0"
            >
              <X className="mr-2 h-4 w-4" />
              Clear filters
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500">
          Showing {sortedQuestions.length} of {questions.length} questions
          {activeFilterCount > 0 && " (filtered)"}
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="question_id" className="w-[100px]">
                  ID
                </SortableHeader>
                <TableHead className="w-[250px]">Description</TableHead>
                <SortableHeader field="topic" className="w-[120px]">
                  Topic
                </SortableHeader>
                <SortableHeader field="type" className="w-[100px]">
                  Type
                </SortableHeader>
                <SortableHeader field="difficulty" className="w-[120px]">
                  Difficulty
                </SortableHeader>
                <TableHead className="w-[80px]">Marks</TableHead>
                <SortableHeader field="createdAt" className="w-[120px]">
                  Created
                </SortableHeader>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {activeFilterCount > 0
                      ? "No questions match your filters. Try adjusting your search criteria."
                      : "No questions found. Create your first question."}
                  </TableCell>
                </TableRow>
              ) : (
                sortedQuestions.map((question) => (
                  <TableRow key={question.question_id}>
                    <TableCell className="font-medium">
                      {question.question_id}
                    </TableCell>
                    <TableCell
                      className="max-w-[250px] truncate"
                      title={question.question_description}
                    >
                      {question.question_description}
                    </TableCell>
                    <TableCell>{question.topic}</TableCell>
                    <TableCell>{question.type}</TableCell>
                    <TableCell>{question.difficulty}</TableCell>
                    <TableCell>{question.total_marks}</TableCell>
                    <TableCell>
                      {question.createdAt?._seconds
                        ? new Date(
                            question.createdAt._seconds * 1000
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedQuestion(question)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Preview</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Question Preview</DialogTitle>
                            </DialogHeader>
                            {selectedQuestion && (
                              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-2">
                                  <h3 className="text-lg font-medium">
                                    Question
                                  </h3>
                                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                                    <div className="whitespace-pre-wrap font-serif">
                                      {selectedQuestion.content}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h3 className="text-lg font-medium">
                                    Answer
                                  </h3>
                                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                                    <div className="whitespace-pre-wrap font-serif">
                                      {selectedQuestion.answer}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                      Question ID
                                    </h3>
                                    <p>{selectedQuestion.question_id}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                      Marks
                                    </h3>
                                    <p>{selectedQuestion.total_marks}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                      Topic
                                    </h3>
                                    <p>
                                      {selectedQuestion.topic} -{" "}
                                      {selectedQuestion.question_topic}
                                    </p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                      Difficulty
                                    </h3>
                                    <p>{selectedQuestion.difficulty}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                      Created
                                    </h3>
                                    <p>
                                      {selectedQuestion.createdAt?._seconds
                                        ? new Date(
                                            selectedQuestion.createdAt
                                              ._seconds * 1000
                                          ).toLocaleString()
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                      Question Size
                                    </h3>
                                    <p>{selectedQuestion.question_size}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(question)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(question.question_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
