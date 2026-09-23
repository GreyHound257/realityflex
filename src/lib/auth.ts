import crypto from 'crypto'
import { promisify } from 'util'

const randomBytes = promisify(crypto.randomBytes)

const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 32 * 1024 * 1024,
}

function scryptAsync(password: string, salt: string, keylen: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, SCRYPT_OPTIONS, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = (await randomBytes(16)).toString('hex')
  const derivedKey = await scryptAsync(password, salt, 32)
  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Support legacy bcrypt hashes used in database seeds
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
  }

  const [salt, key] = hash.split(':')
  if (!salt || !key) return false
  try {
    const derivedKey = await scryptAsync(password, salt, 32)
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey)
  } catch { return false }
}
