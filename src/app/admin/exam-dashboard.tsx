"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuestionsTable } from "./questions-table";
import { QuestionForm } from "./question-form";
import { Question } from "@/types/questionType";
import { toast } from "sonner";
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/lib/firebase/crudQuestions";

// ? use try-catch around the toasts so you can see the error

export function ExamDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  //! this NEEDS to be fixed
  useEffect(() => {
    fetchQuestions(); // first page
  });

  const fetchQuestions = async (cursor?: string) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const url = cursor
        ? `/api/get-questions?limit=5&startAfter=${cursor}`
        : `/api/get-questions?limit=5`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !Array.isArray(data.questions)) {
        throw new Error("Failed to fetch questions");
      }

      setQuestions((prev) => [...prev, ...data.questions]);
      // setNextCursor(data.nextCursor)
      if (!data.nextCursor) setHasMore(false);
    } catch (err) {
      console.error("🔥 Infinite scroll error:", err);
      setHasMore(false);
    }

    setIsLoading(false);
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedQuestion(null);
  };

  const handleDelete = (questionId: string) => {
    // Show confirmation toast first
    toast.info("Are you sure?", {
      description: "This will permanently delete the question.",
      action: {
        label: "Delete",
        onClick: () => confirmDelete(questionId),
      },

      className: "border-red-500",
    });
  };

  // Separated function to handle the actual deletion after confirmation
  const confirmDelete = async (questionId: string) => {
    // Only delete when this function is called (which happens on ToastAction click)
    setQuestions(questions.filter((q) => q.question_id !== questionId));
    //deletes question from firestore db
    const response = await deleteQuestion(questionId);

    if (selectedQuestion?.question_id === questionId) {
      setSelectedQuestion(null);
    }

    //successful deletion toast
    if (response.success) {
      toast.success("Question deleted", {
        description: "The question has been permanently removed.",
      });
    } else {
      toast.error("Failed to delete question");
    }
  };

  const handleSave = async (question: Question) => {
    if (isCreating) {
      setQuestions([...questions, question]);
      setIsCreating(false);
      //creates new question in firebase db
      const response = await createQuestion(question.question_id, question);

      if (response.success) {
        toast.success("Question created", {
          description:
            "The question has been created and uploaded to the database.",
        });
      } else {
        toast.error("Error creating question", {
          description: "Something went wrong.",
        });
      }
    } else {
      setQuestions(
        questions.map((q) =>
          q.question_id === question.question_id ? question : q
        )
      );
      //updates new question in firebase db
      const response = await updateQuestion(question.question_id, question);

      if (response.success) {
        toast.success("Question updated", {
          description:
            "The question has been updated and uploaded to the database.",
        });
      } else {
        toast("Error updating question", {
          description: "Something went wrong.",
        });
      }
    }
    setSelectedQuestion(null);
  };

  const handleCancel = () => {
    setSelectedQuestion(null);
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Exam Builder Dashboard</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {selectedQuestion || isCreating ? (
          <QuestionForm
            question={selectedQuestion}
            isCreating={isCreating}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <QuestionsTable
            questions={questions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
