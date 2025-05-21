import axios from "axios"
import fs from "fs"
import path, { join } from "path"
import sharp from "sharp"
import { getBrightnessScore, getCurrentRelease, getEarth } from "./util"

export class Himawari {
    private cache: {
        release: number,
        thumbnail: string,
        maxRes: string
    }
    private cacheFile: string

    constructor(cacheFile: string) {
        this.cacheFile = cacheFile
        this.cache = JSON.parse(fs.readFileSync(path.join(cacheFile), 'utf-8'))

        //update cache on startup
        this.updateCache()

        //update cache every 5 minutes
        setInterval(() => {
            try {
                this.updateCache()
            }
            catch (err) {
                console.log(`Failed to update cache: ${err}`);
            }
        }, 5 * 60 * 1000);
    }

    async getWallpaper(width: number, height: number, luminance: number) {
        const area = await this.getTopArea(width, height, luminance)
        const fullImage = await sharp(this.cache.maxRes)
        const section = await fullImage.clone().extract(area)

        return section.toBuffer()
    }

    private async getTopArea(width: number, height: number, targetLuminance: number) {
        const thumbnail = await this.getCurrentThumbnail()

        const fullDims = 11000
        const thumbDims = 550
        const factor = fullDims / thumbDims
        const windowWidth = Math.round(width / factor)
        const windowHeight = Math.round(height / factor)
        const step = Math.round(thumbDims / 10)

        let x = 0
        let y = 0
        let topArea = {
            delta: Infinity,
            area: {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }
        }

        while (y + windowHeight + step < thumbDims) {
            const area = {
                left: x,
                top: y,
                width: windowWidth,
                height: windowHeight
            }

            const luminance = await getBrightnessScore(thumbnail, area)

            const delta = Math.abs(targetLuminance - luminance)

            if (topArea.delta > delta) {
                topArea.area = area
                topArea.delta = delta
            }

            if (x + windowWidth + step < thumbDims) {
                x += step
            }
            else {
                x = 0
                y += step
            }
        }

        console.log(`Area provided [${width}x${height}] Luminance: Requested: ${targetLuminance} Delta: ${Math.round(topArea.delta)}`);

        return {
            left: topArea.area.left * factor,
            top: topArea.area.top * factor,
            width: width,
            height: height
        }
    }

    private async getCurrentThumbnail() {
        const thumbnail = await sharp(this.cache.thumbnail)

        return thumbnail
    }

    private async updateCache() {
        console.log('checking for cache update...');
        
        const currentRelease = await getCurrentRelease()

        if (currentRelease.getTime() == this.cache.release) {
            console.log('no cache update needed');
            return
        }

        console.log('updating cache');

        const thumbnail = await getEarth(currentRelease, 1)
        thumbnail.toFile(this.cache.thumbnail)

        const maxRes = await getEarth(currentRelease, 20)
        maxRes.toFile(this.cache.maxRes)

        this.cache.release = currentRelease.getTime()
        fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2))

        console.log('cache updated');
    }
}