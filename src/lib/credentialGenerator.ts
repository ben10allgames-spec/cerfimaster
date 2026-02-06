import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique credential ID for a certificate
 * Format: CERT-XXXX-XXXX-XXXX (where X is alphanumeric)
 */
export function generateCredentialId(): string {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  const part1 = uuid.substring(0, 4);
  const part2 = uuid.substring(4, 8);
  const part3 = uuid.substring(8, 12);
  return `CERT-${part1}-${part2}-${part3}`;
}

/**
 * Generate current date in a formatted string
 * Format: Month DD, YYYY
 */
export function generateCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Generate QR code data URL for verification
 * This can be used to create a QR code that links to the verification page
 */
export function generateVerificationUrl(credentialId: string, baseUrl: string): string {
  return `${baseUrl}/verify?id=${encodeURIComponent(credentialId)}`;
}
