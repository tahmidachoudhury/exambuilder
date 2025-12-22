import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  X,
  FileText,
  Download,
  Sparkles,
  Target,
  Calculator,
  BookX,
  Loader2,
  FileArchive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamQuestion } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ExamSummaryProps {
  questions: ExamQuestion[];
  onRemove: (id: string) => void;
  onReorder: (questions: ExamQuestion[]) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  isDragOver?: boolean;
}

export function ExamSummary({
  questions,
  onRemove,
  onReorder,
  onGenerate,
  isGenerating,
  isDragOver,
}: ExamSummaryProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "exam-summary",
  });

  const totalMarks = questions.reduce((sum, q) => sum + q.total_marks, 0);

  return (
    <aside
      ref={setNodeRef}
      className={cn(
        "w-80 bg-card border-l border-border flex flex-col h-full transition-all duration-200",
        (isOver || isDragOver) && "bg-accent/10 border-accent"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <FileText className="w-4 h-4 text-accent-foreground" />
          </div>
          <h2 className="font-semibold text-foreground">Exam Summary</h2>
        </div>
        <p className="text-sm text-muted-foreground ml-10">
          Drag to reorder questions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 p-4 border-b border-border">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-foreground">
            {questions.length}
          </p>
          <p className="text-xs text-muted-foreground">Questions</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-primary">{totalMarks}</p>
          <p className="text-xs text-muted-foreground">Total Marks</p>
        </div>
      </div>

      {/* Question List */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-3">
          <AnimatePresence mode="popLayout">
            {questions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "drop-zone flex flex-col items-center justify-center py-12 px-4",
                  (isOver || isDragOver) && "active"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground text-center">
                  Drop questions here
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  or click &quot;Add&quot; on any question
                </p>
              </motion.div>
            ) : (
              <SortableContext
                items={questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <SortableQuestionItem
                      key={question.id}
                      question={question}
                      index={index}
                      onRemove={() => onRemove(question.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Random Generator (Coming Soon) */}
        <div className="bg-muted/30 rounded-lg p-3 border border-dashed border-border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Random Exam
            </span>
            <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              Coming soon
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min marks"
              className="bg-background/50"
              disabled
            />
            <Button
              variant="outline"
              size="sm"
              disabled
              className="whitespace-nowrap"
            >
              Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Uses selected filters + minimum marks
          </p>
        </div>

        <Separator />

        {/* Generate Exam Button */}
        <Button
          onClick={onGenerate}
          disabled={questions.length === 0 || isGenerating}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating PDFs...
            </>
          ) : (
            <>
              <FileArchive className="w-5 h-5 mr-2" />
              Generate Exam
            </>
          )}
        </Button>
        {questions.length > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            Downloads as ZIP with exam PDFs
          </p>
        )}
      </div>
    </aside>
  );
}

interface SortableQuestionItemProps {
  question: ExamQuestion;
  index: number;
  onRemove: () => void;
}

function SortableQuestionItem({
  question,
  index,
  onRemove,
}: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "sortable-item bg-background rounded-lg border border-border p-3 group",
        isDragging && "shadow-card-drag opacity-90 z-50"
      )}
      {...attributes}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <button
          {...listeners}
          className="drag-handle flex-shrink-0 mt-0.5"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Question Number */}
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-primary">
            {index + 1}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">
              {question.question_id}
            </span>
            {question.type === "calc" ? (
              <Calculator className="w-3 h-3 text-muted-foreground" />
            ) : (
              <BookX className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-foreground truncate">{question.topic}</p>
          <p className="text-xs text-muted-foreground">
            {question.total_marks} marks · {question.difficulty}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Remove question"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
