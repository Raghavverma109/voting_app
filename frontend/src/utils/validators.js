// src/utils/validators.js
export const isValidAadhar = (s) => {
  if (!s) return false
  const cleaned = ('' + s).replace(/\s+/g, '')
  return /^\d{12}$/.test(cleaned)
}

export const isStrongPassword = (p) => p && p.length >= 6
