import { cn } from '@/utils/cn'

export function Label({ htmlFor, children, className }) {
  return (
    <label htmlFor={htmlFor} className={cn('block text-xs font-medium text-gray-500 mb-1.5', className)}>
      {children}
    </label>
  )
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900',
        'placeholder:text-gray-400 outline-none transition',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
        'disabled:bg-gray-50 disabled:text-gray-400',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900',
        'placeholder:text-gray-400 outline-none transition resize-y min-h-[100px] leading-relaxed',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
        className,
      )}
      {...props}
    />
  )
}

export function FormGroup({ label, htmlFor, error, children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
