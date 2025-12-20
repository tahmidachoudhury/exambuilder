export interface Question {
  id: string;
  question_id: string;
  topic: string;
  question_topic: string;
  difficulty: 'Grade 1-3' | 'Grade 4-5' | 'Grade 6-7' | 'Grade 8-9';
  type: 'calculator' | 'non-calculator';
  content: string;
  answer: string;
  model_answer: string;
  total_marks: number;
  full_page: boolean;
  question_size: number;
  ms_size: number;
  ma_size: number;
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  questionCount: number;
}

export interface TopicCategory {
  name: string;
  topics: Topic[];
}

export type GradeFilter = 'Grade 1-3' | 'Grade 4-5' | 'Grade 6-7' | 'Grade 8-9';
export type CalculatorFilter = 'calculator' | 'non-calculator';

export interface ExamFilters {
  grades: GradeFilter[];
  calculatorTypes: CalculatorFilter[];
}

export interface ExamQuestion extends Question {
  order: number;
}
