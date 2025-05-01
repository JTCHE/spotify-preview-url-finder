# About
A straightforward NextJS application that retrieves a 30-second song preview URL using a Spotify track ID.

The main logic can be found in the **fetch-spotify-preview-url.tsx**

# Roadmap
* Allow more types of searches (by song name, ID, URL)
* Store the state as a URL param
* Use flexbox to fix gap issues on various browsers
* Skeleton loaders
* Allow batch searches and saving results as CSV
* Create usable package

# Credits
This is heavily based on [lakshay007's spotify-preview-finder](https://github.com/lakshay007/spot).
I changed the logic around, as his version required searching using the song title which I thought could have a huge margin of error.
However, I'm giving him all the credits for the scraping logic.