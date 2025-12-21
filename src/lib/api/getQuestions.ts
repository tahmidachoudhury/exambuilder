// src/lib/api/getQuestions.ts

import { Question } from "@/types/exam";

type GetQuestionsParams = {
  topicId: string;
  limit?: number;
  endpoint?: string;
};

/**
 * Fetch questions for a topic (no pagination).
 */
export async function getQuestions({
  topicId,
  limit = 5,
  endpoint = process.env.NEXT_PUBLIC_GET_QUESTIONS_ENDPOINT_URL ??
    "https://api.tacknowledge.co.uk/api/get-questions",
}: GetQuestionsParams): Promise<Question[]> {
  if (!endpoint) {
    throw new Error("Questions API endpoint not configured.");
  }

  const url = `/api/get-questions?limit=5&question_topic=${encodeURIComponent(
    topicId
  )}`;

  const response = await fetch(url);
  const data = await response.json();

  // Expecting: { questions: [...] }
  return data.questions ?? [];
}
