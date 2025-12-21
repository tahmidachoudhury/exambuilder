import { X, Calculator, BookX, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExamFilters, GradeFilter, CalculatorFilter } from "@/types/exam";

interface FilterChipsProps {
  filters: ExamFilters;
  onToggleGrade: (grade: GradeFilter) => void;
  onToggleCalculator: (type: CalculatorFilter) => void;
  onClearAll: () => void;
}

const gradeOptions: { value: GradeFilter; label: string; color: string }[] = [
  {
    value: "Grade 1-3",
    label: "1-3",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    value: "Grade 4-5",
    label: "4-5",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "Grade 6-7",
    label: "6-7",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    value: "Grade 8-9",
    label: "8-9",
    color: "bg-red-100 text-red-700 border-red-200",
  },
];

const calculatorOptions: {
  value: CalculatorFilter;
  label: string;
  icon: typeof Calculator;
}[] = [
  { value: "calc", label: "Calculator", icon: Calculator },
  { value: "non-calc", label: "Non-Calc", icon: BookX },
];

export function FilterChips({
  filters,
  onToggleGrade,
  onToggleCalculator,
  onClearAll,
}: FilterChipsProps) {
  const hasActiveFilters =
    filters.grades.length > 0 || filters.calculatorTypes.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Grade Filters */}
      <div className="flex items-center gap-1.5">
        <GraduationCap className="w-4 h-4 text-muted-foreground mr-1" />
        {gradeOptions.map((grade) => {
          const isActive = filters.grades.includes(grade.value);
          return (
            <button
              key={grade.value}
              onClick={() => onToggleGrade(grade.value)}
              className={cn(
                "filter-chip border transition-all duration-200",
                isActive
                  ? grade.color
                  : "bg-transparent border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <span>{grade.label}</span>
              {isActive && (
                <X className="w-3 h-3 ml-0.5 hover:scale-110 transition-transform" />
              )}
            </button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-border mx-2" />

      {/* Calculator Filters */}
      <div className="flex items-center gap-1.5">
        {calculatorOptions.map((option) => {
          const isActive = filters.calculatorTypes.includes(option.value);
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => onToggleCalculator(option.value)}
              className={cn(
                "filter-chip border transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{option.label}</span>
              {isActive && (
                <X className="w-3 h-3 ml-0.5 hover:scale-110 transition-transform" />
              )}
            </button>
          );
        })}
      </div>

      {/* Clear All */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClearAll}
            className="ml-2 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Clear all
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
