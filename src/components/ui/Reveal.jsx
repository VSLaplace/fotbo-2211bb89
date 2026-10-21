import { cn } from '../../lib/cn.js'
import useReveal from '../../hooks/useReveal.js'

// Обгортка появи при скролі. delay дає каскад (0.08s на елемент) —
// значення динамічне, тому це один із небагатьох дозволених inline-стилів.
export default function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  const { ref, inView } = useReveal()

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={cn('reveal', inView && 'reveal-in', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
