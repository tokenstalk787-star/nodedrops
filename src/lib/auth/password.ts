import crypto from "crypto";

/**
 * Hashes a plaintext password using cryptographically secure scrypt with a unique 16-byte salt.
 * Returns formatted string: `${salt}:${derivedKeyHex}`
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

/**
 * Verifies a plaintext password against a stored `salt:hash` string using constant-time comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!storedHash || !storedHash.includes(":")) {
        return resolve(false);
      }

      const [salt, key] = storedHash.split(":");
      if (!salt || !key) {
        return resolve(false);
      }

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        const keyBuffer = Buffer.from(key, "hex");
        if (keyBuffer.length !== derivedKey.length) {
          return resolve(false);
        }
        resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
      });
    } catch {
      resolve(false);
    }
  });
}
