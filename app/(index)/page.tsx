"use client";

import { useState } from "react";
import SpotifyInput from "./components/input";
import { fetchPreviewUrl } from "./utilities/fetching/actions";
import { Button } from "@/shadcn/components/ui/button";

interface PreviewResult {
  name?: string;
  previewUrl?: string;
  error?: string;
  coverUrl?: string;
}

// Define the expected response type from fetchPreviewUrl
interface SuccessResponse {
  success: true;
  results: {
    name: string;
    previewUrl: string;
    coverUrl: string;
    spotifyUrl?: any;
    duration?: any;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
}

type FetchPreviewResponse = SuccessResponse | ErrorResponse;

export default function Home() {
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (url: string) => {
    setLoading(true);
    try {
      // Call server action to fetch the preview URL
      const response = (await fetchPreviewUrl(url)) as FetchPreviewResponse;

      if (response.success) {
        setResult({
          name: response.results.name,
          previewUrl: response.results.previewUrl,
          coverUrl: response.results.coverUrl,
        });
      } else {
        setResult({ error: response.error });
      }
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
      <section className="max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Spotify Song Preview URL Finder</h1>

        <SpotifyInput onSubmit={handleSubmit} loading={loading} />

        {loading && <p>Loading preview URL...</p>}

        {result && !loading && (
          <div className="w-full space-y-4">
            {result.error ? (
              <div className="p-4 bg-red-100 text-red-700 rounded">Error: {result.error}</div>
            ) : (
              <>
                {result.coverUrl && (
                  <div className="aspect-square w-full rounded overflow-clip">
                    <img src={result.coverUrl} />
                  </div>
                )}

                <audio controls src={result.previewUrl} className="w-full">
                  Your browser does not support the audio element.
                </audio>

                <div className="p-4 bg-gray-100 rounded">
                  <h2 className="font-bold">Track:</h2>
                  <p>{result.name}</p>
                </div>

                {result.previewUrl ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded break-all">
                      <h2 className="font-bold">Preview URL:</h2>
                      <a target="_blank" className="underline text-blue-500" href={result.previewUrl}>
                        {result.previewUrl}
                      </a>
                    </div>
                  </div>
                ) : (
                  <p>No preview URL found for this track.</p>
                )}
              </>
            )}
          </div>
        )}
      </section>
      <section>
        <p className="text-muted-foreground pointer-events-none">
          Made with ֍ by{" "}
          <a href="johnchedeville.com" className="pointer-events-auto hover:text-primary transition">
            John C.
          </a>
        </p>
      </section>
    </main>
  );
}
