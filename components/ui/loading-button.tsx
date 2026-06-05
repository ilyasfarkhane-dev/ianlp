import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean
  loadingText?: React.ReactNode
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn('cursor-pointer transition-colors duration-200', className)}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="size-4" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
