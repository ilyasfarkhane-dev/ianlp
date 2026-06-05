import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

type PageLoadingProps = {
  label?: string
  className?: string
  compact?: boolean
}

export function PageLoading({ label = 'Loading…', className, compact }: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        compact ? 'py-12' : 'min-h-[50vh] py-16',
        className
      )}
    >
      <Spinner className="size-8 text-primary" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  )
}
