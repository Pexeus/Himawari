"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axios = void 0;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
exports.axios = axios_1.default.create({
    httpsAgent: new https_1.default.Agent({ rejectUnauthorized: false })
});
//# sourceMappingURL=constants.js.map