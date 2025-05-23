import sys from 'systeminformation';
import axios from "axios"
import os from "os"
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(readFileSync(path.join(__dirname, 'config.json'), 'utf-8'))
const api = axios.create({
    baseURL: config.api,
    responseType: 'arraybuffer'
})

async function updateWallpaper() {
    try {
        console.log('getting system info...');

        const graphics = await sys.graphics();

        const width = Math.max(...graphics.displays.map(d => d.resolutionX));
        const height = Math.max(...graphics.displays.map(d => d.resolutionY));
        const imgPath = path.join(os.tmpdir(), 'wallpaper.jpg')

        console.log(`${graphics.displays.length} Displays detected. Downloading ${width}x${height} wallpaper...`);
        const res = await api.get(`/wallpaper/${width}/${height}/${config.luminance}`)
        writeFileSync(imgPath, res.data)
        console.log(`Download Completed (${imgPath}). Setting Wallpaper...`);

        if (os.platform() == 'win32') {
            const scriptPath = path.join(__dirname, 'set-wallpaper-win.ps1')
            const cmd = `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}" -imagePath "${imgPath}"`;

            exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return;
                }
                console.log(`Stdout: ${stdout}`);
            });
        }
    }
    catch (err) {
        console.log('failed to update Wallpaper', err);
    }
}

function startScheduler() {
    if (!config.enabled) return;

    let nextExecution = Date.now() + config.interval;

    const intervalId = setInterval(async () => {
        const now = Date.now();
        console.log(`Checking at ${new Date().toISOString()}, next execution: ${new Date(nextExecution).toISOString()}`);

        if (now >= nextExecution) {
            await updateWallpaper();
            nextExecution = now + config.interval;
        }
    }, 10000);

    process.on('SIGINT', () => {
        clearInterval(intervalId);
        console.log('Scheduler stopped on Ctrl+C');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        clearInterval(intervalId);
        console.log('Scheduler cancelled');
        process.exit(0);
    });
}

startScheduler();
updateWallpaper()