// Українське форматування дат, діапазонів, часу й чисел для сторінок конгресу.
// Уся робота з датами на сайті йде через ці функції — жодних toLocaleDateString
// з англійською локаллю в компонентах.

export const UA_MONTHS_GENITIVE = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
]

export const UA_MONTHS_NOMINATIVE = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
]

const UA_WEEKDAYS = [
  'неділя',
  'понеділок',
  'вівторок',
  'середа',
  'четвер',
  'п\'ятниця',
  'субота',
]

const pad2 = (value) => String(value).padStart(2, '0')

const isRealDate = (date) => date instanceof Date && !Number.isNaN(date.getTime())

/**
 * Розбирає дату без «стрибка» часового поясу: рядок '2026-10-15' стає
 * локальною північчю, а не UTC-північчю (інакше на західних таймзонах
 * дата з'їжджає на день назад).
 */
export function parseDate(value) {
  if (isRealDate(value)) return value
  if (typeof value === 'number') return new Date(value)
  if (typeof value !== 'string') return null
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim())
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  const parsed = new Date(value)
  return isRealDate(parsed) ? parsed : null
}

export const isValidDate = (value) => Boolean(parseDate(value))

/** 15 жовтня 2026 */
export function formatUaDate(value, { year = true } = {}) {
  const date = parseDate(value)
  if (!date) return typeof value === 'string' ? value : ''
  const base = `${date.getDate()} ${UA_MONTHS_GENITIVE[date.getMonth()]}`
  return year ? `${base} ${date.getFullYear()}` : base
}

/** 15.10.2026 — для табличних підписів і легенд */
export function formatUaDateNumeric(value) {
  const date = parseDate(value)
  if (!date) return typeof value === 'string' ? value : ''
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()}`
}

/** четвер, 15 жовтня 2026 */
export function formatUaDateWithWeekday(value, options) {
  const date = parseDate(value)
  if (!date) return formatUaDate(value, options)
  return `${UA_WEEKDAYS[date.getDay()]}, ${formatUaDate(date, options)}`
}

/** четвер */
export function formatUaWeekday(value) {
  const date = parseDate(value)
  return date ? UA_WEEKDAYS[date.getDay()] : ''
}

/**
 * 15–17 жовтня 2026 · 30 вересня – 2 жовтня 2026 · 30 грудня 2026 – 2 січня 2027
 * Один рядок — саме те, що стоїть у шапці й підвалі.
 */
export function formatUaRange(start, end, { year = true } = {}) {
  const from = parseDate(start)
  const to = parseDate(end)
  if (!from) return typeof start === 'string' ? start : ''
  if (!to || from.getTime() === to.getTime()) return formatUaDate(from, { year })

  const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()
  if (sameMonth) return `${from.getDate()}–${to.getDate()} ${UA_MONTHS_GENITIVE[to.getMonth()]} ${to.getFullYear()}`

  const sameYear = from.getFullYear() === to.getFullYear()
  if (sameYear) {
    return `${from.getDate()} ${UA_MONTHS_GENITIVE[from.getMonth()]} – ${to.getDate()} ${UA_MONTHS_GENITIVE[to.getMonth()]} ${to.getFullYear()}`
  }
  return `${formatUaDate(from)} – ${formatUaDate(to)}`
}

/** '09:00' + '10:30' -> '09:00–10:30' (тире без пробілів — як у програмі) */
export function formatTimeRange(from, to) {
  if (!from && !to) return ''
  if (!from) return to
  if (!to) return from
  return `${from}–${to}`
}

/** 3 -> ['дні', ...] за правилами українського числівника */
export function pluralUa(count, [one, few, many]) {
  const n = Math.abs(Math.round(Number(count) || 0))
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/** withCountUa(3, ['день', 'дні', 'днів']) -> '3 дні' */
export function withCountUa(count, forms) {
  return `${count} ${pluralUa(count, forms)}`
}

/** Календарна різниця в днях від `from` до `value` (ціле, може бути від'ємним). */
export function daysUntil(value, from = new Date()) {
  const target = parseDate(value)
  const origin = parseDate(from)
  if (!target || !origin) return null
  const a = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const b = new Date(origin.getFullYear(), origin.getMonth(), origin.getDate())
  return Math.round((a.getTime() - b.getTime()) / 86400000)
}

/** 'через 240 днів' · 'завтра' · 'сьогодні' · 'минуло 12 днів' */
export function formatDaysLeft(value, from = new Date()) {
  const days = daysUntil(value, from)
  if (days === null) return ''
  if (days === 0) return 'сьогодні'
  if (days === 1) return 'завтра'
  if (days === -1) return 'учора'
  if (days > 0) return `через ${withCountUa(days, ['день', 'дні', 'днів'])}`
  return `${withCountUa(Math.abs(days), ['день', 'дні', 'днів'])} тому`
}

/** 1 250 — розряди нерозривним пробілом */
export function formatUaNumber(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value ?? '')
  return new Intl.NumberFormat('uk-UA').format(n).replace(/\u00A0/g, '\u2009')
}
