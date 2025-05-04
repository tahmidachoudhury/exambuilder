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
  createdAt: { _seconds: number; _nanoseconds: number }
}
