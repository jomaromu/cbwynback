"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
// instanciar el router
const visa = (0, express_1.Router)();
// ==================================================================== //
// ruta prueba
// ==================================================================== //
visa.post('/', (req, resp) => {
    const username = 'WI3OHFSLI8M0L01SK3H121ohG6Ugen4LCqVY4yXUu4NXxhoiA';
    const password = 'VcYBCUjvvtMjS07c';
    const key = '../visa/assets/key_d02cae9e-55be-40ea-8079-665a2c56c2e8.pem';
    const cert = '../visa/assets/cert.pem';
    const options = {
        hostname: 'sandbox.api.visa.com',
        port: 443,
        uri: 'https://sandbox.api.visa.com/vdp/helloworld',
        method: 'GET',
        key: fs_1.default.readFileSync(key),
        cert: fs_1.default.readFileSync(cert),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        },
        json: true
    };
    // options.agent = new https.Agent(options);
    request_1.default.get(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status: ${res.statusCode}`);
        console.log(body);
    });
    resp.send('Hello World');
    // resp.json({
    //     ok: true,
    //     mensaje: 'Visa prueba funcionando'
    // });
});
exports.default = visa;
