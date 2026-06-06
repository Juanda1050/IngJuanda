import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playlists = [
  { name: "Ye", id: "0ccS7amNmG3WVrhPuNSUXv" },
  { name: "Disnatia", id: "1SpZWyTjTj3y4TnB0rRhWc" },
  { name: "Passionfruit", id: "5qKJDdE5oy3Bak1FE243bm" },
  { name: "Lay down", id: "6Hpw8tl9eRn4XKGI789nIG" },
  { name: "Vietnam", id: "3wHAlDF26cGREeyhtPgt2k" },
  { name: "Vibing", id: "0WCw5RtcGxrK4llwrVMN6v" },
  { name: "Lapse", id: "7ElVkkltjvPGcTcwkQtgzs" },
  { name: "Darkside", id: "1JfT9tFy8IRXzrOfLbXaJf" },
  { name: "Fresa", id: "1HPpexJnqHJCdAuyTqKkii" },
  { name: "Norteñas", id: "2dk4qwxMvvwOnaeXBOjc32" },
  { name: "recent", id: "7KoMS4vvyiIg0zipXtWJ6w" },
  { name: "Banda", id: "5TbaEwohwSnTNO7ZhwCN48" },
  { name: "topic", id: "5dYqrGoyGIpnbbRxvA329t" },
  { name: "Stuff", id: "30lvEjbnSpYXjIyfzrq6Ch" },
  { name: "Dope", id: "4PB7mzTKmHVCSXAsVDbqvh" },
  { name: "El Principe", id: "6ZssVYSnyZ9Y5uG9aP8OtO" },
  { name: "Before 2000's", id: "70m1t5tJlhuJixymPsuPRC" },
  { name: "RnB", id: "4u5YInigUKpRQu51w8MZbw" },
  { name: "Indie", id: "3zSXDJ0KsUFeIjUrxjWmg0" },
  { name: "Smooth Jazz", id: "2fB3MEZzMFvwRC8WBIxDTe" },
  { name: "Urbano", id: "4ptC1tHArT7x4ZW1gSZZeg" },
  { name: "Relax", id: "2s6xBpBQrmf53MjMaUEpeo" },
  { name: "Rap", id: "4sYraV8fepDUK1MszTQExg" },
  { name: "Pop", id: "31xGVRr9GstT6smiGP7mmA" },
  { name: "Safe place", id: "7hOCJB6J6HbTvJti25XDVs" },
  { name: "Beliconas", id: "6g5J7nrCijgeo7569CYLDW" },
  { name: "House", id: "0qoZC9fnp9cyHfOkaHLOvo" },
  { name: "ジャズ", id: "2MqgcYvAEpiMoMqRCyWUQ6" },
  { name: "Chill", id: "6xoaowR8UkIO7c9iKQQ45E" },
  { name: "Electro", id: "7yWeTqRTXokjdracPflRun" },
  { name: "Night vibe", id: "10olPU6xnAev2sBG6ObDdF" },
  { name: "Big Time Rush – BTR", id: "5PjcejQcSN3yfob79Wnz3Z" },
  { name: "Tilin, El Creador", id: "1uh4rXZV2rLQvMpPXVLsbd" },
  { name: "Camilo Séptimo", id: "6OUnRyoBUyBHxo7TZbsZp5" },
  { name: "Underground", id: "3ST9cVlpWm4EFYhiEdYx1L" },
  { name: "JN", id: "4ed4fxTEcOjCIAZlW1KEGX" },
  { name: "Románticas", id: "4xzJSwRQCIrqW9YtaRwcur" },
  { name: "Luis Miguel", id: "4u7IxxJSoTUh90uwj4Y2Bd" },
  { name: "Baladas", id: "5CBX5atMXA08hvmleTpjE2" },
  { name: "Tropical", id: "3lfTEzUKlz5ddW52rA9H6c" },
  { name: "Selena", id: "7IKfnl2kxPOjMCekBWDzaI" },
];

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapePlaylistEmbed(playlistId) {
  const url = `https://open.spotify.com/embed/playlist/${playlistId}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP status ${res.status}`);
  }
  const html = await res.text();

  let match = html.match(
    /<script id="resource" type="application\/json">([^<]+)<\/script>/,
  );
  if (!match) {
    match = html.match(
      /<script id="initial-state" type="application\/json">([^<]+)<\/script>/,
    );
  }
  if (!match) {
    match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/,
    );
  }

  if (!match || !match[1]) {
    throw new Error("No script block found in HTML");
  }

  const data = JSON.parse(match[1]);
  const state = data.props ? data.props.pageProps.state : data;
  const entity = state.data ? state.data.entity : state.entity;

  if (!entity) {
    throw new Error("Could not parse entity from JSON data");
  }

  // Extract cover image
  let coverUrl = "";
  if (
    entity.coverArt &&
    entity.coverArt.sources &&
    entity.coverArt.sources.length > 0
  ) {
    coverUrl = entity.coverArt.sources[0].url;
  }

  // Extract tracks
  const tracks = (entity.trackList || []).map((t) => {
    return {
      id: t.uri,
      title: t.title,
      artist: t.subtitle || "Unknown Artist",
      album: entity.name,
      duration: Math.round(t.duration / 1000), // convert ms to seconds
      audioUrl: t.audioPreview ? t.audioPreview.url : "",
    };
  });

  return {
    id: playlistId,
    name: entity.name,
    description: entity.subtitle || "",
    coverUrl: coverUrl,
    tracks: tracks,
  };
}

async function startSync() {
  const result = [];
  const errors = [];
  console.log(`Starting sync of ${playlists.length} playlists...`);

  for (let i = 0; i < playlists.length; i++) {
    const pl = playlists[i];
    console.log(
      `[${i + 1}/${playlists.length}] Fetching playlist "${pl.name}" (${pl.id})...`,
    );
    try {
      const data = await scrapePlaylistEmbed(pl.id);
      result.push(data);
      console.log(
        `  Successfully synced "${data.name}" with ${data.tracks.length} tracks.`,
      );
    } catch (err) {
      console.error(`  Failed to sync playlist "${pl.name}":`, err.message);
      errors.push({ name: pl.name, id: pl.id, error: err.message });
    }
    await delay(300);
  }

  const outDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, "spotify-cache.json");
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
  console.log(
    `\nSync finished. Cached ${result.length} playlists to ${outFile}.`,
  );
  if (errors.length > 0) {
    console.warn(`Encountered errors in ${errors.length} playlists:`, errors);
  }
}

startSync();
