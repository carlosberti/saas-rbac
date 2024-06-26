export function createSlug(text: string) {
  // Remove accents and diacritics
  text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Remove special characters and symbols
  text = text.replace(/[^\w\s-]/g, '').trim()

  // Replace spaces with hyphens
  text = text.replace(/\s+/g, '-')

  text = text.toLowerCase()

  return text
}
