"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import {
  Question,
  ExamQuestion,
  ExamFilters,
  GradeFilter,
  CalculatorFilter,
} from "@/types/exam";
import {
  topicCategories,
  generateQuestionsForTopic,
  allTopics,
} from "@/data/mockData";
import { TopicSidebar } from "./TopicSidebar";
import { FilterChips } from "./FilterChips";
import { QuestionsPanel } from "./QuestionsPanel";
import { ExamSummary } from "./ExamSummary";
import { QuestionPreviewModal } from "./QuestionPreviewModal";
import { QuestionCard } from "./QuestionCard";
import { Categories } from "@/lib/topics";
import { getQuestions } from "@/lib/api/getQuestions";
import { generateExamZip } from "@/lib/api/generateExam";

export default function ExamBuilder() {
  // State
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState<ExamFilters>({
    grades: [],
    calculatorTypes: [],
  });
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragOverSummary, setIsDragOverSummary] = useState(false);

  // Sensors for drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Computed values
  const addedQuestionIds = useMemo(
    () => new Set(examQuestions.map((q) => q.id)),
    [examQuestions]
  );

  const selectedTopicData = useMemo(
    () => allTopics.find((t) => t.topic === selectedTopic),
    [selectedTopic]
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const gradeMatch =
        filters.grades.length === 0 || filters.grades.includes(q.difficulty);
      const calcMatch =
        filters.calculatorTypes.length === 0 ||
        filters.calculatorTypes.includes(q.type);
      return gradeMatch && calcMatch;
    });
  }, [questions, filters]);

  const activeQuestion = useMemo(
    () => questions.find((q) => q.id === activeId),
    [questions, activeId]
  );

  // Handlers
  const handleSelectTopic = useCallback(async (topicId: string) => {
    setSelectedTopic(topicId);
    setIsLoading(true);
    setError(null);

    // Simulate API call
    try {
      const questions = await getQuestions({
        topicId,
        limit: 5,
      });

      setQuestions(questions);
      console.log("Fetched questions:", questions);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to load questions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddQuestion = useCallback(
    (question: Question) => {
      if (addedQuestionIds.has(question.id)) return;

      const examQuestion: ExamQuestion = {
        ...question,
        order: examQuestions.length,
      };
      setExamQuestions((prev) => [...prev, examQuestion]);
      toast.success(`Added "${question.question_id}" to exam`);
    },
    [addedQuestionIds, examQuestions.length]
  );

  const handleRemoveQuestion = useCallback((id: string) => {
    setExamQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.info("Question removed from exam");
  }, []);

  const handleToggleGrade = useCallback((grade: GradeFilter) => {
    setFilters((prev) => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter((g) => g !== grade)
        : [...prev.grades, grade],
    }));
  }, []);

  const handleToggleCalculator = useCallback((type: CalculatorFilter) => {
    setFilters((prev) => ({
      ...prev,
      calculatorTypes: prev.calculatorTypes.includes(type)
        ? prev.calculatorTypes.filter((t) => t !== type)
        : [...prev.calculatorTypes, type],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ grades: [], calculatorTypes: [] });
  }, []);

  const handleGenerateExam = useCallback(async () => {
    if (examQuestions.length === 0) return;

    setIsGenerating(true);
    toast.info("Generating exam PDFs...");

    // Simulate API call
    // ! api call to backend goes here https://api.tacknowledge.co.uk/api/generate-exam

    try {
      console.log(examQuestions);

      await generateExamZip({
        questions: examQuestions,
        filenamePrefix: "exam",
      });

      toast.success("Exam generated successfully! Download starting...");

      console.log("Success! Reached endpoint");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to generate exam"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [examQuestions]);

  // Drag handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setIsDragOverSummary(over?.id === "exam-summary");
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setIsDragOverSummary(false);

      if (!over) return;

      // Dropping into exam summary from questions panel
      if (over.id === "exam-summary") {
        const question = questions.find((q) => q.id === active.id);
        if (question) {
          handleAddQuestion(question);
        }
        return;
      }

      // Reordering within exam summary
      if (active.id !== over.id) {
        setExamQuestions((prev) => {
          const oldIndex = prev.findIndex((q) => q.id === active.id);
          const newIndex = prev.findIndex((q) => q.id === over.id);

          if (oldIndex === -1 || newIndex === -1) return prev;

          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    },
    [questions, handleAddQuestion]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-background">
        <div className="flex flex-1 min-h-0">
          {/* Topic Sidebar */}
          <TopicSidebar
            categories={Categories}
            selectedTopic={selectedTopic}
            onSelectTopic={handleSelectTopic}
            isLoading={isLoading}
          />

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Header with Filters */}
            <header className="bg-card border-b border-border px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Maths Exam Builder
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Build custom exams by selecting questions from topics
                  </p>
                </div>
              </div>
              <FilterChips
                filters={filters}
                onToggleGrade={handleToggleGrade}
                onToggleCalculator={handleToggleCalculator}
                onClearAll={handleClearFilters}
              />
            </header>

            {/* Questions Panel */}
            <QuestionsPanel
              questions={filteredQuestions}
              selectedTopic={selectedTopic}
              topicName={selectedTopicData?.topic ?? null}
              isLoading={isLoading}
              error={error}
              addedQuestionIds={addedQuestionIds}
              onAddQuestion={handleAddQuestion}
              onPreviewQuestion={setPreviewQuestion}
              onRetry={() => selectedTopic && handleSelectTopic(selectedTopic)}
            />
          </main>

          {/* Exam Summary */}
          <ExamSummary
            questions={examQuestions}
            onRemove={handleRemoveQuestion}
            onReorder={setExamQuestions}
            onGenerate={handleGenerateExam}
            isGenerating={isGenerating}
            isDragOver={isDragOverSummary}
          />
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeQuestion && (
            <div className="question-card dragging w-[400px]">
              <QuestionCard
                question={activeQuestion}
                onAdd={() => {}}
                onPreview={() => {}}
              />
            </div>
          )}
        </DragOverlay>

        {/* Preview Modal */}
        <QuestionPreviewModal
          question={previewQuestion}
          isOpen={!!previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          onAdd={() => {
            if (previewQuestion) {
              handleAddQuestion(previewQuestion);
            }
          }}
          isAdded={
            previewQuestion ? addedQuestionIds.has(previewQuestion.id) : false
          }
        />
      </div>
    </DndContext>
  );
}
