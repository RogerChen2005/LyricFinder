import path from 'path'
import os from 'os'
import fs from 'fs'

export const PORT = 3030
export const TEMP_PATH = path.join(__dirname, '..', 'temp')

const isDev = process.env.NODE_ENV !== 'production'
export const COOKIE_PATH = isDev
  ? path.resolve(__dirname, '..', JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')).cookiePath)
  : path.join(os.homedir(), '.cookie')
console.log(`Cookie path: ${COOKIE_PATH} (${isDev ? 'dev' : 'prod'})`)

export function ensureTempPath(): void {
  if (!fs.existsSync(TEMP_PATH)) {
    fs.mkdirSync(TEMP_PATH, { recursive: true })
  }
}

export function loadCookie(): string {
  return String(fs.readFileSync(COOKIE_PATH))
}
