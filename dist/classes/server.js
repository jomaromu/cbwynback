"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const enviroment_1 = require("../global/enviroment");
const socket_1 = require("../sockets/socket");
// exportar clase
class Server {
    constructor() {
        this.app = (0, express_1.default)(); // crear express
        this.port = enviroment_1.objetoEnviroment.port;
        this.httpServer = new http_1.default.Server(this.app); // crear el servidor
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
