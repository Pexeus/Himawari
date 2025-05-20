export declare class Himawari {
    private cache;
    private cacheFile;
    constructor(cacheFile: string);
    getWallpaper(width: number, height: number, luminance: number): Promise<Buffer<ArrayBufferLike>>;
    private getTopArea;
    private getCurrentThumbnail;
    private updateCache;
}
//# sourceMappingURL=Himawari.d.ts.map