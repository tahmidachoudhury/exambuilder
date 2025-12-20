import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, BookX, Plus, Check, FileText, Hash, Target } from 'lucide-react';
import { Question } from '@/types/exam';
import { cn } from '@/lib/utils';

interface QuestionPreviewModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  isAdded?: boolean;
}

const difficultyColors: Record<Question['difficulty'], string> = {
  'Grade 1-3': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Grade 4-5': 'bg-amber-100 text-amber-700 border-amber-200',
  'Grade 6-7': 'bg-orange-100 text-orange-700 border-orange-200',
  'Grade 8-9': 'bg-red-100 text-red-700 border-red-200',
};

export function QuestionPreviewModal({
  question,
  isOpen,
  onClose,
  onAdd,
  isAdded,
}: QuestionPreviewModalProps) {
  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">Question {question.question_id}</DialogTitle>
              <p className="text-sm text-muted-foreground">{question.topic}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn('border', difficultyColors[question.difficulty])}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {question.type === 'calculator' ? (
                <>
                  <Calculator className="w-3 h-3" />
                  Calculator
                </>
              ) : (
                <>
                  <BookX className="w-3 h-3" />
                  Non-Calculator
                </>
              )}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {question.total_marks} {question.total_marks === 1 ? 'mark' : 'marks'}
            </Badge>
          </div>

          <Separator />

          {/* Question Content */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Question
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
              {question.content}
            </div>
          </div>

          {/* Answer Preview */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Answer</h4>
            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
              {question.answer}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Question Size</p>
              <p className="text-sm font-semibold">{question.question_size}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">MS Size</p>
              <p className="text-sm font-semibold">{question.ms_size}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">MA Size</p>
              <p className="text-sm font-semibold">{question.ma_size}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            onClick={onAdd}
            disabled={isAdded}
            className={cn(
              'flex-1',
              isAdded && 'bg-success text-success-foreground hover:bg-success/90'
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added to Exam
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add to Exam
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
