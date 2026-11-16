import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { Icon } from './icons'

interface ToastContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const showToast = useCallback((next: string) => {
    setMessage(next)
  }, [])

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(null), 3800)
    return () => window.clearTimeout(timer)
  }, [message])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <div aria-live='polite' className='toast' role='status'>
          <span className='toast__icon'>
            <Icon name='check' size={15} />
          </span>
          <span>{message}</span>
          <button
            aria-label='Dismiss message'
            className='toast__close'
            onClick={() => setMessage(null)}
            type='button'
          >
            <Icon name='x' size={14} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider')
  }
  return context
}
