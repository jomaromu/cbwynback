"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = __importDefault(require("../classes/server"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enviroment_1 = require("../global/enviroment");
// esquemas - modelo
const users_1 = __importDefault(require("../models/users"));
const negocio_1 = __importDefault(require("../models/negocio"));
const usuario_1 = __importDefault(require("../classes/usuario"));
// instanciar clase negocio
const usuarioClass = new usuario_1.default();
// instanciar el router
const usuario = (0, express_1.Router)();
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
usuario.post('/registrar', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    // crear eschema del usuario
    const usuarioRegistrar = new users_1.default({
        correo: req.body.correo,
        password: req.body.password,
        soyMayor: req.body.soyMayor,
        fechaAlta: req.body.fechaAlta,
        role: req.body.role,
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
}));
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
// ==================================================================== //
// Actualizar un usuario
// ==================================================================== //
usuario.put('/actualizarPerfil', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const idUsuario = req.body.idUsuario;
    const idSocket = req.get('idSocket');
    // console.log(idSocket);
    // console.log(req.body);
    // console.log(req.files?.avatar);
    const id = req.body.idUsuario;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const rutaAvatar = yield usuarioClass.transformaImgs(req.files, id);
    const avatar = rutaAvatar.data[0];
    // console.log(avatar);
    users_1.default.findByIdAndUpdate(id, { nombre, apellido, avatar }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error interno`
            });
        }
        else {
            const server = server_1.default.instance;
            // server.io.emit('actualizar-perfil', usuarioDB);
            server.io.to(`${idSocket}`).emit('actualizar-perfil', usuarioDB);
            resp.json({
                ok: true,
                mensaje: `Perfil acutalizado`
            });
        }
    });
}));
// ==================================================================== //
// obtener avatar para perfil
// ==================================================================== //
usuario.get('/getMultimediaAll', (req, resp) => {
    const pathPipe = req.query.multi;
    // const multimedia = path.resolve(`../uploads/${pathPipe}`);
    const multimedia = path_1.default.resolve(__dirname, `../uploads/${pathPipe}`);
    return resp.sendFile(multimedia);
    // '../dist/uploads/6043f3fe57751d03f033beb2/6043f3fe57751d03f033beb2-336/portada.png'
});
exports.default = usuario;
