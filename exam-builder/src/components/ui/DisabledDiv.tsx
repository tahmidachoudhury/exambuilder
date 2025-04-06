import { cn } from "@/lib/utils"

type Props = {
  disabled?: boolean
  children: React.ReactNode
}

export function DisabledDiv({ disabled, children }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 bg-muted transition-opacity",
        disabled && "opacity-50 pointer-events-none select-none"
      )}
    >
      {children}
    </div>
  )
}
