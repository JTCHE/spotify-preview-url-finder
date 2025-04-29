'use client';

import { useState } from 'react';

interface SpotifyInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function SpotifyInput({ onSubmit, loading }: SpotifyInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.includes('spotify.com/track/')) {
      onSubmit(url);
    } else {
      alert('Invalid Spotify URL. Please enter a valid Spotify track URL.');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Spotify track URL"
          className="p-2 border border-gray-300 rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="p-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Loading...' : 'Get Preview URL'}
        </button>
      </form>
    </div>
  );
}