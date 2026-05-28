import path from 'path'
import fs from 'fs'

export const PORT = 3030
export const TEMP_PATH = path.join(__dirname, '..', 'temp')
export const COOKIE_PATH = path.join(__dirname, '..', 'cookies', 'cookie.txt')

export function ensureTempPath(): void {
  if (!fs.existsSync(TEMP_PATH)) {
    fs.mkdirSync(TEMP_PATH, { recursive: true })
  }
}

export function loadCookie(): string {
  return String(fs.readFileSync(COOKIE_PATH))
}
