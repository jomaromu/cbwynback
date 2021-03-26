"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const enviroment_1 = require("../global/enviroment");
// exportar clase
class Server {
    constructor() {
        this.app = express_1.default(); // crear express
        this.port = enviroment_1.objetoEnviroment.port;
        this.httpServer = new http_1.default.Server(this.app); // crear el servidor
    }
    // metodo que levanta el servidor
    start(callback) {
        this.httpServer.listen(this.port, callback());
    }
}
exports.default = Server;
