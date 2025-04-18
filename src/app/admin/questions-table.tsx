"use client"

import { Edit, Eye, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Question } from "./exam-dashboard"

interface QuestionsTableProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (questionId: string) => void
}

export function QuestionsTable({ questions, onEdit, onDelete }: QuestionsTableProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No questions found. Create your first question.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question.question_id}>
                  <TableCell className="font-medium">{question.question_id}</TableCell>
                  <TableCell>{question.question_description}</TableCell>
                  <TableCell>{question.topic}</TableCell>
                  <TableCell>{question.type}</TableCell>
                  <TableCell>{question.difficulty}</TableCell>
                  <TableCell>{question.total_marks}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setSelectedQuestion(question)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Preview</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Question Preview</DialogTitle>
                          </DialogHeader>
                          {selectedQuestion && (
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <h3 className="text-lg font-medium">Question</h3>
                                <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                                  <div className="whitespace-pre-wrap font-serif">{selectedQuestion.content}</div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h3 className="text-lg font-medium">Answer</h3>
                                <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                                  <div className="whitespace-pre-wrap font-serif">{selectedQuestion.answer}</div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Question ID</h3>
                                  <p>{selectedQuestion.question_id}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Marks</h3>
                                  <p>{selectedQuestion.total_marks}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Topic</h3>
                                  <p>
                                    {selectedQuestion.topic} - {selectedQuestion.question_topic}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Difficulty</h3>
                                  <p>{selectedQuestion.difficulty}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" onClick={() => onEdit(question)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onDelete(question.question_id)}>
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
    </>
  )
}
