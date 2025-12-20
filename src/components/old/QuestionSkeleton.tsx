export default function QuestionSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3 animate-pulse">
      <div className="flex justify-between items-start">
        <div>
          <div className="h-5 w-32 bg-muted rounded"></div>
          <div className="h-4 w-48 bg-muted rounded mt-2"></div>
        </div>
        <div className="h-9 w-16 bg-muted rounded"></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-6 w-16 bg-muted rounded"></div>
        ))}
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <div className="h-16 w-full bg-muted rounded"></div>
      </div>
    </div>
  )
}
