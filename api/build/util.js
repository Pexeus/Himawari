"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEarth = getEarth;
exports.getTile = getTile;
exports.formatDate = formatDate;
exports.getCurrentRelease = getCurrentRelease;
exports.getBrightnessScore = getBrightnessScore;
const sharp_1 = __importDefault(require("sharp"));
const https_1 = __importDefault(require("https"));
const constants_1 = require("./constants");
async function getEarth(release, zoom) {
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
    const compositeImage = (0, sharp_1.default)({
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
async function getTile(release, zoom, x, y) {
    const url = `https://himawari8.nict.go.jp/img/D531106/${zoom}d/550/${formatDate(release)}00_${x}_${y}.png`;
    const res = await constants_1.axios.get(url, { responseType: "arraybuffer" });
    return res.data;
}
function formatDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day}/${hour}${minute}`;
}
async function getCurrentRelease() {
    const agent = new https_1.default.Agent({ rejectUnauthorized: false });
    const res = await constants_1.axios.get("https://himawari8-dl.nict.go.jp/himawari.asia/img/FULL_24h/latest.json", { httpsAgent: agent });
    const date = new Date(res.data.date);
    console.log(`release: ${formatDate(date)}`);
    return date;
}
async function getBrightnessScore(image, area) {
    const section = await image.clone().extract(area).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { data, info } = section;
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        total += 0.2126 * r + 0.7152 * g + 0.0722 * b; // Luminance
    }
    await image.clone().extract(area);
    return total / (info.width * info.height);
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//# sourceMappingURL=util.js.map