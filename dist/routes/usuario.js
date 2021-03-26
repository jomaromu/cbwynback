"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enviroment_1 = require("../global/enviroment");
// esquemas - modelo
const users_1 = __importDefault(require("../models/users"));
const negocio_1 = __importDefault(require("../models/negocio"));
// instanciar el router
const usuario = express_1.Router();
// ==================================================================== //
// ruta principal
// ==================================================================== //
usuario.get('/', (req, resp) => {
    return resp.json({
        ok: true,
        mensaje: 'Rutas de los usuarios'
    });
});
// ==================================================================== //
// registrar un usuario
// ==================================================================== //
usuario.post('/registrar', (req, resp) => {
    // crear eschema del usuario
    const usuarioRegistrar = new users_1.default({
        correo: req.body.correo,
        password: req.body.password,
        soyMayor: req.body.soyMayor,
        fechaAlta: req.body.fechaAlta,
        role: req.body.role
    });
    usuarioRegistrar.save((err, usuarioDB) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `No se pudo crear el usuario, ${err.message}`,
                err
            });
        }
        else {
            return resp.json({
                ok: true,
                usuarioDB
            });
        }
    });
});
// ==================================================================== //
// loguear un usuario
// ==================================================================== //
usuario.post('/entrar', (req, resp) => {
    const correo = req.body.correo;
    const password = req.body.password;
    let token = null;
    users_1.default.findOne({ correo: correo, password: password }, (err, usuarioDB) => {
        // error interno
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error, ${err}`,
                err
            });
        }
        // error al no encontrar usuario
        if (!usuarioDB) {
            return resp.json({
                ok: false,
                mensaje: `Usuario incorrecto o no existe`
            });
        }
        else {
            // crear objeto jwt
            token = jsonwebtoken_1.default.sign({ usuarioDB }, enviroment_1.objetoEnviroment.claveToken, { expiresIn: 60 * 60 });
            // si existe el usuario
            return resp.json({
                ok: true,
                mensaje: `Acceso correcto`,
                usuarioDB,
                token
            });
        }
    });
});
// ==================================================================== //
// decodificar token
// ==================================================================== //
usuario.get('/decodedToken', (req, resp) => {
    const token = req.get('token');
    // decodificar token y enviar respuesta
    jsonwebtoken_1.default.verify(`${token}`, enviroment_1.objetoEnviroment.claveToken, (err, usuarioDBToken) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `No se pudo verificar el token`,
                err
            });
        }
        else {
            return resp.json({
                ok: true,
                usuarioDBToken
            });
        }
    });
});
// ==================================================================== //
// obtener un usuario por ID
// ==================================================================== //
usuario.get('/getUserId', (req, resp) => {
    const id = req.get('id');
    let token = null;
    users_1.default.findById({ _id: id }, (err, usuarioDB) => {
        // error interno
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error, ${err}`,
                err
            });
        }
        // error al no encontrar usuario
        if (!usuarioDB) {
            return resp.json({
                ok: false,
                mensaje: `Usuario incorrecto o no existe`
            });
        }
        else {
            // crear objeto jwt
            token = jsonwebtoken_1.default.sign({ usuarioDB }, enviroment_1.objetoEnviroment.claveToken, { expiresIn: 60 * 60 });
            // si existe el usuario
            return resp.json({
                ok: true,
                mensaje: `Acceso correcto`,
                usuarioDB,
                token
            });
        }
    });
});
// ==================================================================== //
// obtener negocios por ID del usuario
// ==================================================================== //
usuario.get('/negociosUsuario', (req, resp) => {
    const id = req.get('id');
    negocio_1.default.find({ usuario: id }, (err, negocioDB) => {
        if (err) {
            resp.json({
                ok: false,
                mensaje: `Error al buscar proyectos de este usuario`,
                err
            });
        }
        else {
            resp.json({
                ok: true,
                mensaje: `Búsuqueda correcta`,
                negocioDB
            });
        }
    });
});
exports.default = usuario;
