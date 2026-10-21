import { useEffect, useState } from 'react'
import { list } from '../services/api.js'

// Одна колекція — один запит на весь застосунок: результати кешуються в модулі,
// тому шапка, підвал і сторінка не смикають API по черзі.

const cache = new Map()

export function useCollection(name) {
  const [data, setData] = useState(() => cache.get(name) ?? [])
  const [loading, setLoading] = useState(() => !cache.has(name))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache.has(name)) {
      setData(cache.get(name))
      setLoading(false)
      return undefined
    }

    let alive = true
    setLoading(true)
    setError(null)

    list(name)
      .then((rows) => {
        const value = Array.isArray(rows) ? rows : []
        cache.set(name, value)
        if (alive) {
          setData(value)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (alive) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      alive = false
    }
  }, [name])

  return { data, loading, error }
}

/** Колекція-«одинак» (congress, venue, society): повертає перший рядок. */
export function useSingleton(name) {
  const { data, loading, error } = useCollection(name)
  return { data: data[0] ?? null, loading, error }
}

/** Скидання кешу — потрібне лише після запису в колекцію. */
export function invalidateCollection(name) {
  cache.delete(name)
}
