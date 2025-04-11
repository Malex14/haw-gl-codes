import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';

const ALGO = 'aes-256-gcm';

// Input: UTF-8 encoded plaintext string
// Output BASE64 encoded encrypted string
export function encryptCookie(content: string): string {
	const key = Buffer.from(env.COOKIE_SECRET, 'base64');
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv(ALGO, key, iv);

	let ciphertext = cipher.update(content, 'utf8');
	ciphertext = Buffer.concat([ciphertext, cipher.final()]);

	const buffer = Buffer.concat([ciphertext, iv, cipher.getAuthTag()]);

	return buffer.toString('base64url');
}

// Input: BASE64 encoded encrypted string
// Output UTF-8 encoded plaintext string
export function decryptCookie(cookie: string): string {
	const decoded = Buffer.from(cookie, 'base64url');

	const ciphertext = Buffer.copyBytesFrom(decoded, 0, decoded.byteLength - (12 + 16));
	const iv = Buffer.copyBytesFrom(decoded, decoded.byteLength - (12 + 16), 12);
	const authTag = Buffer.copyBytesFrom(decoded, decoded.byteLength - 16);

	const key = Buffer.from(env.COOKIE_SECRET, 'base64');
	const decipher = crypto.createDecipheriv(ALGO, key, iv);
	decipher.setAuthTag(authTag);

	const buffer = decipher.update(ciphertext);

	return Buffer.concat([buffer, decipher.final()]).toString('utf8');
}
