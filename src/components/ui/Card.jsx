import { cn } from '@/utils/cn'

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('bg-white border border-gray-100 rounded-xl p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-sm font-medium text-gray-800', className)}>{children}</h3>
}

export function CardContent({ className, children }) {
  return <div className={cn('', className)}>{children}</div>
}
