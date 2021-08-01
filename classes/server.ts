import express from 'express';
import socketIO from 'socket.io';
import http from 'http';
import { objetoEnviroment } from '../global/enviroment';
import { Socket } from 'socket.io';
import { emitGetIds } from '../sockets/socket';

// exportar clase
export default class Server {

    // propiedades
    private static _instance: Server;

    public app: express.Application;
    public port: Number;

    public io: socketIO.Server;
    public httpServer: http.Server;
    public cliente: any[];
    public idClenSock: any;

    constructor() {

        this.app = express(); // crear express
        this.port = objetoEnviroment.port;
        this.httpServer = new http.Server(this.app); // crear el servidor
        this.cliente = [];
        // this.idClenSock = '';

        // configurar io
        this.io = new socketIO.Server(this.httpServer, {
            cors: {
                origin: true,
                credentials: true
            }
        });

        this.escucharConexiones();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    // escuchar conexiones
    private escucharConexiones(): void {
        console.log('escuchando conexiones');

        // iniciar conexiones de sockets
        this.io.on('connection', (cliente) => {
            console.log('Clientes conectado');

            // recibir solicitud de usuarios activos
            emitGetIds(cliente, this.io);

        });

    }

    // metodo que levanta el servidor
    start(callback: Function): void {
        this.httpServer.listen(this.port, callback());
    }
}