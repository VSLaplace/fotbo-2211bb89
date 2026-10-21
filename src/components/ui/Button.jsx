import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn.js'

// Квадратні кути, моно-підпис у верхньому регістрі, інверсія на hover.
// Рендериться як <Link>, <a> або <button> залежно від переданих пропсів.

const VARIANTS = {
  solid: 'bg-ink text-paper hover:bg-carmine hover:text-paper',
  accent: 'bg-carmine text-paper hover:bg-ink hover:text-paper',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
  outlineInverse: 'border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink',
  quiet: 'text-teal hover:text-carmine px-0 py-0',
}

const SIZES = {
  sm: 'px-3.5 py-2 text-[10px]',
  md: 'px-5 py-2.5 text-[11px]',
  lg: 'px-7 py-3.5 text-[12px]',
}

export default function Button({
  to,
  href,
  variant = 'solid',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2.5 rounded-[2px] font-mono uppercase tracking-[0.18em] transition-all duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carmine disabled:cursor-not-allowed disabled:opacity-60',
    VARIANTS[variant] ?? VARIANTS.solid,
    variant === 'quiet' ? null : SIZES[size] ?? SIZES.md,
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
