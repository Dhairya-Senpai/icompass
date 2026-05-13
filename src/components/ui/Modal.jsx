import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

export function Modal({ open, onClose, title, subtitle, children, className }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose?.() }}
    >
      <div className={cn('bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6', className)}>
        {(title || onClose) && (
          <div className="flex items-start justify-between mb-1">
            <div>
              {title && <h2 className="font-serif text-xl font-normal text-gray-900">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {onClose && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4 mt-0.5" aria-label="Close modal">
                <i className="ti ti-x text-lg" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
