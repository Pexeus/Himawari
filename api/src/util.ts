import sharp from "sharp";
import https from "https";
import { axios } from "./constants";

export async function getEarth(release: Date, zoom: number): Promise<sharp.Sharp> {
    const tileSize = 550; // Each tile is 550x550 pixels

    // Create array of promises for parallel tile fetching
    const tilePromises = [];
    for (let y = 0; y < zoom; y++) {
        for (let x = 0; x < zoom; x++) {
            tilePromises.push(getTile(release, zoom, x, y));
        }
    }

    // Fetch all tiles in parallel
    const tiles = await Promise.all(tilePromises);

    // Create a blank canvas for the combined image
    const compositeImage = sharp({
        create: {
            width: tileSize * zoom,
            height: tileSize * zoom,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    });

    // Composite tiles onto the canvas
    const composites = tiles.map((tile, index) => ({
        input: tile,
        left: (index % zoom) * tileSize,
        top: Math.floor(index / zoom) * tileSize,
    }));

    return compositeImage.composite(composites).png();
}

export async function getTile(release: Date, zoom: number, x: number, y: number) {
    const url = `https://himawari8.nict.go.jp/img/D531106/${zoom}d/550/${formatDate(release)}00_${x}_${y}.png`

    const res = await axios.get(url, { responseType: "arraybuffer" })

    return res.data
}

export function formatDate(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day}/${hour}${minute}`;
}

export async function getCurrentRelease(): Promise<Date> {
    const agent = new https.Agent({ rejectUnauthorized: false });

    const res = await axios.get("https://himawari8-dl.nict.go.jp/himawari.asia/img/FULL_24h/latest.json", { httpsAgent: agent })
    const date = new Date(res.data.date)

    console.log(`release: ${formatDate(date)}`);
    

    return date
}

export async function getBrightnessScore(image: sharp.Sharp, area: { left: number, width: number, top: number, height: number }) {
    const section = await image.clone().extract(area).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    const { data, info } = section;
    let total = 0;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        total += 0.2126 * r + 0.7152 * g + 0.0722 * b; // Luminance
    }

    await image.clone().extract(area)
    return total / (info.width * info.height);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));