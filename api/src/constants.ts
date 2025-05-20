import axisos from "axios";
import https from "https";

export const axios = axisos.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
})