"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Himawari_1 = require("./Himawari");
const express_1 = __importDefault(require("express"));
const himawari8 = new Himawari_1.Himawari("./data/cache.json");
const app = (0, express_1.default)();
const port = 80;
app.get("/wallpaper/:width/:height/:luminance", async (req, res) => {
    try {
        const width = parseInt(req.params.width);
        const height = parseInt(req.params.height);
        const luminance = parseInt(req.params.luminance);
        const buffer = await himawari8.getWallpaper(width, height, luminance);
        res.end(buffer);
    }
    catch (err) {
        res.end(err);
    }
});
app.listen(port, () => {
    console.log('API Online');
});
//# sourceMappingURL=index.js.map