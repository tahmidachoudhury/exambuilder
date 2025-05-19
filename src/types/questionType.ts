export type Question = {
  question_id: string
  content: string
  answer: string
  ms_size: number
  total_marks: number
  topic: string
  type: string
  question_topic: string
  question_description: string
  model_answer: string
  ma_size: number
  difficulty: string
  full_page: boolean
  question_size: number
  createdAt: { _seconds: number; _nanoseconds: number }
}
