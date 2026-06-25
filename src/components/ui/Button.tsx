'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, disabled, className = '', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed'

    const sizes: Record<string, string> = {
      sm: 'px-4 py-2 text-sm min-h-[44px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    }

    const variants: Record<string, string> = {
      primary: 'text-white hover:opacity-90 active:scale-95',
      secondary: 'border hover:opacity-80 active:scale-95',
      ghost: 'hover:opacity-70 active:scale-95',
    }

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: { backgroundColor: 'var(--color-primary)' },
      secondary: { borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' },
      ghost: { color: 'var(--color-text-secondary)' },
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        style={variantStyles[variant]}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
