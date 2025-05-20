import { Himawari } from "./Himawari";
import express from "express"

const himawari8 = new Himawari("./data/cache.json")
const app = express()
const port = 80

app.get("/wallpaper/:width/:height/:luminance", async (req, res) => {
    try {
        const width = parseInt(req.params.width)
        const height = parseInt(req.params.height)
        const luminance = parseInt(req.params.luminance)

        const buffer = await himawari8.getWallpaper(width, height, luminance)

        res.end(buffer)
    }
    catch(err) {
        res.end(err)
    }
})

app.listen(port, () => {
    console.log('API Online');
})
