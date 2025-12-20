import { forwardRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Plus, GripVertical, Calculator, BookX, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/types/exam';
import { Button } from '@/components/ui/button';

interface QuestionCardProps {
  question: Question;
  onAdd: () => void;
  onPreview: () => void;
  isAdded?: boolean;
  index?: number;
}

const difficultyStyles: Record<Question['difficulty'], string> = {
  'Grade 1-3': 'grade-badge grade-easy',
  'Grade 4-5': 'grade-badge grade-medium',
  'Grade 6-7': 'grade-badge grade-hard',
  'Grade 8-9': 'grade-badge grade-expert',
};

export const QuestionCard = forwardRef<HTMLDivElement, QuestionCardProps>(
  function QuestionCard({ question, onAdd, onPreview, isAdded, index = 0 }, ref) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: question.id,
      data: { question },
    });

    const style = transform
      ? {
          transform: CSS.Transform.toString(transform),
          zIndex: isDragging ? 50 : undefined,
        }
      : undefined;

    return (
      <motion.div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        style={style}
        className={cn(
          'question-card group',
          isDragging && 'dragging',
          isAdded && 'ring-2 ring-success/50 bg-success/5'
        )}
        {...attributes}
      >
        {/* Drag Handle + Content Area */}
        <div className="flex gap-3">
          {/* Drag Handle */}
          <div
            {...listeners}
            className="drag-handle flex-shrink-0 pt-0.5"
            aria-label="Drag to add to exam"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Main Content - Clickable for Preview */}
          <button
            onClick={onPreview}
            className="flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {question.question_id}
                </span>
                <span className={difficultyStyles[question.difficulty]}>
                  {question.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {question.type === 'calculator' ? (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calculator className="w-3.5 h-3.5" />
                    Calc
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookX className="w-3.5 h-3.5" />
                    Non-Calc
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-foreground line-clamp-2 mb-2 font-mono">
              {question.content}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{question.topic}</span>
              <span className="text-xs font-semibold text-primary">
                {question.total_marks} {question.total_marks === 1 ? 'mark' : 'marks'}
              </span>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="flex-1 text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={onAdd}
            disabled={isAdded}
            className={cn(
              'flex-1',
              isAdded
                ? 'bg-success/10 text-success border border-success/20 hover:bg-success/10'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            <Plus className={cn('w-4 h-4 mr-1.5', isAdded && 'rotate-45')} />
            {isAdded ? 'Added' : 'Add'}
          </Button>
        </div>
      </motion.div>
    );
  }
);
