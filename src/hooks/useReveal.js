import { useEffect, useRef, useState } from 'react'

// Поява секцій при скролі без сторонніх бібліотек: IntersectionObserver
// виставляє прапорець, а клас `reveal` / `reveal-in` з src/index.css
// робить решту (opacity + translateY, 0.5s ease).

export default function useReveal({ threshold = 0.12, rootMargin = '0px 0px -8% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
