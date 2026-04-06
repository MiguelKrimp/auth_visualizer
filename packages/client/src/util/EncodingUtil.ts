export function encodeBasicCredentials(username: string, password: string): string {
  const rawCredentials = `${username}:${password}`;
  const bytes = new TextEncoder().encode(rawCredentials);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary);
}
