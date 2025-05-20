"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Himawari = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const util_1 = require("./util");
class Himawari {
    constructor(cacheFile) {
        this.cacheFile = cacheFile;
        this.cache = JSON.parse(fs_1.default.readFileSync(path_1.default.join(cacheFile), 'utf-8'));
        //update cache every 5 minutes
        setInterval(() => {
            try {
                this.updateCache();
            }
            catch (err) {
                console.log(`Failed to update cache: ${err}`);
            }
        }, 5 * 60 * 1000);
    }
    async getWallpaper(width, height, luminance) {
        const area = await this.getTopArea(width, height, luminance);
        const fullImage = await (0, sharp_1.default)(this.cache.maxRes);
        const section = await fullImage.clone().extract(area);
        return section.toBuffer();
    }
    async getTopArea(width, height, targetLuminance) {
        const thumbnail = await this.getCurrentThumbnail();
        const fullDims = 11000;
        const thumbDims = 550;
        const factor = fullDims / thumbDims;
        const windowWidth = Math.round(width / factor);
        const windowHeight = Math.round(height / factor);
        const step = Math.round(thumbDims / 10);
        let x = 0;
        let y = 0;
        let topArea = {
            delta: Infinity,
            area: {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }
        };
        while (y + windowHeight + step < thumbDims) {
            const area = {
                left: x,
                top: y,
                width: windowWidth,
                height: windowHeight
            };
            const luminance = await (0, util_1.getBrightnessScore)(thumbnail, area);
            const delta = Math.abs(targetLuminance - luminance);
            if (topArea.delta > delta) {
                topArea.area = area;
                topArea.delta = delta;
            }
            if (x + windowWidth + step < thumbDims) {
                x += step;
            }
            else {
                x = 0;
                y += step;
            }
        }
        console.log(`Area provided [${width}x${height}] Luminance: Requested: ${targetLuminance} Delta: ${Math.round(topArea.delta)}`);
        return {
            left: topArea.area.left * factor,
            top: topArea.area.top * factor,
            width: width,
            height: height
        };
    }
    async getCurrentThumbnail() {
        const thumbnail = await (0, sharp_1.default)(this.cache.thumbnail);
        return thumbnail;
    }
    async updateCache() {
        const currentRelease = await (0, util_1.getCurrentRelease)();
        if (currentRelease.getTime() == this.cache.release)
            return;
        const thumbnail = await (0, util_1.getEarth)(currentRelease, 1);
        thumbnail.toFile(this.cache.thumbnail);
        const maxRes = await (0, util_1.getEarth)(currentRelease, 20);
        maxRes.toFile(this.cache.maxRes);
        this.cache.release = currentRelease.getTime();
        fs_1.default.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
        console.log('cache updated');
    }
}
exports.Himawari = Himawari;
//# sourceMappingURL=Himawari.js.map