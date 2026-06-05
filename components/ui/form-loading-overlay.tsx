import { Spinner } from '@/components/ui/spinner'

type FormLoadingOverlayProps = {
  loading: boolean
  label?: string
}

export function FormLoadingOverlay({ loading, label = 'Saving…' }: FormLoadingOverlayProps) {
  if (!loading) return null

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/75 backdrop-blur-[1px] motion-reduce:backdrop-blur-none"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 shadow-sm">
        <Spinner className="size-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
