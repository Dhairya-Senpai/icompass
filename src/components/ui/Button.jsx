import { cn } from '@/utils/cn'

const VARIANTS = {
  primary:   'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700',
  secondary: 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50',
  danger:    'bg-red-600 text-white border-red-600 hover:bg-red-700',
  ghost:     'bg-transparent text-gray-600 border-transparent hover:bg-gray-100',
}

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs gap-1',
  md: 'px-3.5 py-2 text-sm gap-1.5',
  lg: 'px-5 py-2.5 text-base gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  disabled,
  loading,
  children,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center font-medium rounded-lg border transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading && <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
