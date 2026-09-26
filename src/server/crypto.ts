import crypto from 'crypto';

// AES-256-GCM requires a 32-byte key
function getEncryptionKey(): Buffer {
  const envKey = process.env.TOKEN_ENCRYPTION_KEY;
  if (envKey && envKey.length === 64) {
    return Buffer.from(envKey, 'hex');
  }
  
  // Deterministic 32-byte fallback derived from SESSION_SECRET or constant salt
  const secret = process.env.SESSION_SECRET || 'gitpulse-default-secure-fallback-salt-2026';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypt a plain text string using AES-256-GCM.
 * Output format: "ivHex:authTagHex:encryptedHex"
 */
export function encryptToken(text: string): string {
  if (!text) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a cipher text string using AES-256-GCM.
 */
export function decryptToken(cipherText: string): string {
  if (!cipherText) return '';
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token format');
    }
    
    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Failed to decrypt token:', err);
    throw new Error('Token decryption failed');
  }
}
