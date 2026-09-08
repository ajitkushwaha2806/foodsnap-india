const SECRET_KEY_SEED = process.env.PAYLOAD_CIPHER_KEY

async function getCryptoKey() {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY_SEED),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("foodsnap_salt_salt_99"),
      iterations: 1000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a JSON object into a Base64 ciphertext string
 * @param {Object|Array} data
 * @returns {Promise<string>}
 */
export async function encryptPayload(data) {
  try {
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const encodedData = enc.encode(JSON.stringify(data));

    // Generate random 12-byte IV for AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );

    // Combine IV + Encrypted Data into single buffer
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedContent), iv.length);

    // Convert to Base64
    let binary = "";
    const bytes = combined;
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error("[Payload Encryption Error]:", error);
    return null;
  }
}

/**
 * Decrypt a Base64 ciphertext string back into original JSON data
 * @param {string} encryptedBase64
 * @returns {Promise<any>}
 */
export async function decryptPayload(encryptedBase64) {
  try {
    if (!encryptedBase64 || typeof encryptedBase64 !== "string") {
      return encryptedBase64;
    }

    const key = await getCryptoKey();
    const binary = atob(encryptedBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      data
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  } catch (error) {
    console.error("[Payload Decryption Error]:", error);
    return null;
  }
}
