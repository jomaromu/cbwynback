import express from 'express';
import http from 'http';
import { objetoEnviroment } from '../global/enviroment';

// exportar clase
export default class Server {

    // propiedades
    public app: express.Application;
    public port: Number;
    public httpServer: http.Server;

    constructor() {

        this.app = express(); // crear express
        this.port = objetoEnviroment.port;
        this.httpServer = new http.Server(this.app); // crear el servidor
    }

    // metodo que levanta el servidor
    start(callback: Function): void {
        this.httpServer.listen(this.port, callback());
    }
}