'use server';

import extractTrackId from '../extractTrackID';
import { getPreviewLinkById } from './fetch-spotify-preview-url';

export async function fetchPreviewUrl(url: string) {
  try {
    const trackId = extractTrackId(url);
    
    if (!trackId) {
      return {
        success: false,
        error: 'Invalid Spotify URL. Could not extract track ID.'
      };
    }
    
    const result = await getPreviewLinkById(trackId);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}