const KEY_SEED = process.env.NEXT_PUBLIC_PAYLOAD_CIPHER_KEY;
let cachedKey = null;

async function getCryptoKey() {
  if (cachedKey) return cachedKey;

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(KEY_SEED),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  cachedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("foodsnap_salt_99"),
      iterations: 1000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  return cachedKey;
}

function toBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i += 32768) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 32768));
  }
  return btoa(binary);
}

function fromBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypt a JSON payload into a Base64 string
 */
export async function encryptPayload(data) {
  try {
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(JSON.stringify(data))
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return toBase64(combined);
  } catch (error) {
    console.error("[Payload Encryption Error]:", error);
    return null;
  }
}

/**
 * Decrypt a Base64 string back into original JSON
 */
export async function decryptPayload(encryptedBase64) {
  try {
    if (!encryptedBase64 || typeof encryptedBase64 !== "string") {
      return encryptedBase64;
    }

    const key = await getCryptoKey();
    const bytes = fromBase64(encryptedBase64);

    if (bytes.length < 13) return null;

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (error) {
    console.error("[Payload Decryption Error]:", error);
    return null;
  }
}
