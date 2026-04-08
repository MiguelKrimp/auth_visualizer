export function encodeBasicCredentials(username: string, password: string): string {
  const rawCredentials = `${username}:${password}`;
  const bytes = new TextEncoder().encode(rawCredentials);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary);
}

export function toUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
