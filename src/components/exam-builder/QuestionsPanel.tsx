import { motion } from 'framer-motion';
import { FileQuestion, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Question } from '@/types/exam';
import { QuestionCard } from './QuestionCard';
import { Button } from '@/components/ui/button';

interface QuestionsPanelProps {
  questions: Question[];
  selectedTopic: string | null;
  topicName: string | null;
  isLoading: boolean;
  error: string | null;
  addedQuestionIds: Set<string>;
  onAddQuestion: (question: Question) => void;
  onPreviewQuestion: (question: Question) => void;
  onRetry: () => void;
}

export function QuestionsPanel({
  questions,
  selectedTopic,
  topicName,
  isLoading,
  error,
  addedQuestionIds,
  onAddQuestion,
  onPreviewQuestion,
  onRetry,
}: QuestionsPanelProps) {
  // Empty State - No topic selected
  if (!selectedTopic) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Select a topic to begin
          </h3>
          <p className="text-muted-foreground">
            Choose a topic from the sidebar to load questions. You can then add
            them to your exam by clicking or dragging.
          </p>
        </motion.div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Loading questions...
          </h3>
          <p className="text-muted-foreground">
            Fetching questions for {topicName}
          </p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Failed to load questions
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Empty Results
  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No questions match your filters
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your grade or calculator filters to see more questions.
          </p>
        </motion.div>
      </div>
    );
  }

  // Questions Grid
  return (
    <div className="flex-1 overflow-auto p-6 scrollbar-thin">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">{topicName}</h2>
        <p className="text-sm text-muted-foreground">
          {questions.length} questions available
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isAdded={addedQuestionIds.has(question.id)}
            onAdd={() => onAddQuestion(question)}
            onPreview={() => onPreviewQuestion(question)}
          />
        ))}
      </div>
    </div>
  );
}
