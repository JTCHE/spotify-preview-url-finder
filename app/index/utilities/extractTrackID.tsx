/**
 * Extracts track ID from Spotify URL
 */
export default function extractTrackId(url: string): string {
  // Match the track ID part of the URL and remove any query parameters
  const match = url.match(/track\/([^?]+)/);
  return match ? match[1] : "";
}
