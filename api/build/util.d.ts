import sharp from "sharp";
export declare function getEarth(release: Date, zoom: number): Promise<sharp.Sharp>;
export declare function getTile(release: Date, zoom: number, x: number, y: number): Promise<any>;
export declare function formatDate(date: Date): string;
export declare function getCurrentRelease(): Promise<Date>;
export declare function getBrightnessScore(image: sharp.Sharp, area: {
    left: number;
    width: number;
    top: number;
    height: number;
}): Promise<number>;
//# sourceMappingURL=util.d.ts.map