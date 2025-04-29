"use server";
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const SpotifyWebApi = require("spotify-web-api-node");

/* -------------------------------------------------------------------------- */
/*                     Utility Functions and Custom Hooks                     */
/* -------------------------------------------------------------------------- */

/** React hook for getting the preview URL by providing the song ID
 * @param {string} trackId - Spotify track ID
 * @returns {Object} Object containing loading state, error, and results
 */
export async function useGetPreviewLinkById(trackId: string) {
  return getPreviewLinkById(trackId);
}

/** Handle and format errors
 * @param {any} error - The error to process
 * @returns {string} Formatted error message
 */
function catchError(error: Error) {
  return error instanceof Error ? error.message : "An unknown error occurred";
}

/** Creates and configures a Spotify API client
 * @returns {SpotifyWebApi} Configured Spotify API client
 */
function createSpotifyApi() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables are required");
  }

  return new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
  });
}

/* -------------------------------------------------------------------------- */
/*                               Main functions                               */
/* -------------------------------------------------------------------------- */

/** Get Spotify preview URLs using a Spotify song ID
 * @param {string} trackId - Spotify track ID
 * @returns {Promise<Object>} Object containing success status, error (if any), and results
 */
export async function getPreviewLinkById(trackId: string) {
  try {
    if (!trackId) {
      throw new Error("Track ID is required");
    }

    // Initialize and authorize Spotify API
    const spotifyApi = createSpotifyApi();
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // Get track details from Spotify API
    const trackResponse = await spotifyApi.getTrack(trackId);
    if (!trackResponse || !trackResponse.body) {
      throw new Error("No track found");
    }

    const track = trackResponse.body;

    // Get preview URLs by scraping the Spotify web page
    const previewUrl = await getSpotifyLinks(trackId);

    return {
      success: true,
      results: {
        name: `${track.name} - ${track.artists.map((artist: { name: string }) => artist.name).join(", ")}`,
        spotifyUrl: track.external_urls.spotify,
        duration: track.duration_ms,
        previewUrl: previewUrl,
        coverUrl: track.album.images[0].url,
      },
    };
  } catch (error: Error | any) {
    console.error(`Error processing track ID ${trackId}:`, catchError(error));
    return {
      success: false,
      error: catchError(error),
      results: {},
    };
  }
}

/** Scrapes Spotify links from a track's web page
 * @param {string} trackId - Spotify track ID
 * @returns {Promise<string[]>} Array of scraped URLs containing p.scdn.co
 */
async function getSpotifyLinks(trackId: string) {
  try {
    const url = `https://open.spotify.com/track/${trackId}`;
    // console.log(url);
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const scdnLinks = new Set();
    $("*").each((i: number, element: { attribs: string }) => {
      const attrs = element.attribs;
      Object.values(attrs).forEach((value) => {
        if (value && value.includes("p.scdn.co")) {
          scdnLinks.add(value);
        }
      });
    });

    const previewURL: string = Array.from(scdnLinks)[0] as string;

    return previewURL;
  } catch (error: Error | any) {
    throw new Error(`Failed to fetch preview URLs: ${catchError(error)}`);
  }
}
