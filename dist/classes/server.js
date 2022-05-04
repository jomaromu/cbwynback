"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const https_1 = __importDefault(require("https"));
const enviroment_1 = require("../global/enviroment");
const socket_1 = require("../sockets/socket");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// exportar clase
class Server {
    constructor() {
        this.app = (0, express_1.default)(); // crear express
        this.port = enviroment_1.objetoEnviroment.port;
        // this.httpServer = new http.Server(this.app); // crear el servidor
        this.httpServer = https_1.default.createServer({
            key: fs_1.default.readFileSync(path_1.default.join(__dirname, '../cert', 'key.pem')),
            cert: fs_1.default.readFileSync(path_1.default.join(__dirname, '../cert', 'cert.pem')),
        }, this.app); // crear el servidor
        this.cliente = [];
        // this.idClenSock = '';
        // configurar io
        this.io = new socket_io_1.default.Server(this.httpServer, {
            cors: {
                origin: true,
                credentials: true
            }
        });
        this.escucharConexiones();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    // escuchar conexiones
    escucharConexiones() {
        console.log('escuchando conexiones');
        // iniciar conexiones de sockets
        this.io.on('connection', (cliente) => {
            console.log('Clientes conectado');
            // recibir solicitud de usuarios activos
            (0, socket_1.emitGetIds)(cliente, this.io);
        });
    }
    // metodo que levanta el servidor
    start(callback) {
        this.httpServer.listen(this.port, callback());
    }
}
exports.default = Server;
