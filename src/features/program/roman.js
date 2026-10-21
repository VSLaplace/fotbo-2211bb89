// Римські числа для «якорів» колонок: день I, II, III — як у нумерації таблиць атласу.

const ROMAN = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
]

export function roman(value) {
  const index = Number(value)
  if (!Number.isFinite(index) || index < 1) return String(value ?? '')
  return ROMAN[index - 1] ?? String(index)
}
