// Адаптер для статичного сайту на Vercel: віддає дані напряму з mockData.js
import { MOCK_DATA } from '../data/mockData.js';

let token = null

export function setToken(value) {
  token = value
}

export function getToken() {
  return token
}

export async function list(collection) {
  return MOCK_DATA[collection] || []
}

export async function get(collection, id) {
  const items = MOCK_DATA[collection] || []
  return items.find(item => item.id === id) || null
}

export async function create(collection, item) {
  return item
}

export async function update(collection, id, item) {
  return item
}

export async function patch(collection, id, changes) {
  return changes
}

export async function remove(collection, id) {
  return null
}

export async function adminSchema() {
  return {}
}

export async function login(password) {
  token = "mock-static-token"
  return token
}

export async function first(collection) {
  const data = await list(collection)
  if (Array.isArray(data)) return data[0] ?? null
  return data ?? null
}

export async function overview() {
  return {
    congress: MOCK_DATA.congress?.[0] || null,
    keyDates: MOCK_DATA.keyDates || [],
    contacts: MOCK_DATA.contacts || [],
  }
}

export const byOrder = (rows = []) =>
  [...rows].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

export async function submitInquiry(payload) {
  return { success: true, message: "Запит успішно зареєстровано" }
}
