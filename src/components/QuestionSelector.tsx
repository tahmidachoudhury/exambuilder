import { useEffect, useState } from "react"
import { MultiSelect } from "@/components/ui/multi-select"
import { truncate } from "@/app/admin/questions-table"
import type { Question } from "@/types/questionType"

interface QuestionSelectorProps {
  questions: Question[] // backendQuestions
  onSelect: (selectedQuestions: Question[]) => void
  selectedValues: string[]
  onSelectedValuesChange: (values: string[]) => void
  filteredQuestions?: Question[] // optional
}

export function QuestionSelector({
  questions,
  filteredQuestions = [],
  onSelect,
  selectedValues,
  onSelectedValuesChange,
}: QuestionSelectorProps) {
  const displayedQuestions =
    filteredQuestions.length > 0 ? filteredQuestions : questions

  const options = displayedQuestions.map((question) => ({
    label: `${question.question_id}: ${question.question_topic}`,
    value: question.question_id,
    desc: truncate(question.question_description, 50),
  }))

  const handleChange = (chosenIds: string[]) => {
    onSelectedValuesChange(chosenIds)
    const selectedQuestions = questions.filter((q) =>
      chosenIds.includes(q.question_id)
    )
    onSelect(selectedQuestions)
  }

  return (
    <MultiSelect
      options={options}
      selected={selectedValues}
      onChange={handleChange}
      placeholder="Select questions"
    />
  )
}
