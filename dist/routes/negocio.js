"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const rimraf_1 = __importDefault(require("rimraf"));
// esquemas - modelo
const negocio_1 = __importDefault(require("../models/negocio"));
const negocio_2 = __importDefault(require("../classes/negocio"));
// metodos
const filtros = __importStar(require("../methods/negocio"));
// instanciar el router
const negocio = express_1.Router();
// instanciar clase negocio
const negocioClass = new negocio_2.default;
// ==================================================================== //
// crear un negocio
// ==================================================================== //
negocio.post('/nuevoNegocio', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const rutas = yield negocioClass.transformaImgs(req.files, req.body.usuario);
    const nuevoNegocio = new negocio_1.default({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        tipoNegocio: req.body.tipoNegocio,
        tiempo: req.body.tiempo,
        monto: req.body.monto,
        categoria: req.body.categoria,
        ubicacion: req.body.ubicacion,
        utilidad: req.body.utilidad,
        retorno: req.body.retorno,
        garantia: req.body.garantia,
        otras: req.body.otras,
        logo: rutas.data[0],
        portada: rutas.data[1],
        img: rutas.data[4],
        video: rutas.data[2],
        docs: rutas.data[3],
        codigoTel: req.body.codigoTel,
        numeroTel: req.body.numeroTel,
        pagWeb: req.body.pagWeb,
        usuario: req.body.usuario,
        rutaNegocio: rutas.rutaNegocio,
        rutaUsuario: rutas.rutaUsuario,
        rutaCorta: rutas.rutanegocioCorta
    });
    // guardar el negocio
    nuevoNegocio.save((err, negocioDB) => {
        // error interno
        if (err) {
            return resp.json({
                ok: false,
                mensaje: 'Error al crear negocio',
                err
            });
            // si todo va bien
        }
        else {
            return resp.json({
                ok: true,
                mensaje: 'Negocio creado',
                negocioDB
            });
        }
    });
}));
// ==================================================================== //
// obtener todos los negocios
// ==================================================================== //
negocio.get('/obtenerTodos', (req, resp) => {
    negocio_1.default.find({ estado: true }, (err, negocioDB) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err
            });
        }
        else {
            return resp.json({
                ok: true,
                mensaje: `Todos los negocios obtenidos`,
                negocioDB
            });
        }
    });
});
// ==================================================================== //
// obtener multimedia para todos
// ==================================================================== //
negocio.get('/getMultimediaAll', (req, resp) => {
    const pathPipe = req.query.multi;
    const multimedia = path_1.default.resolve(`../dist/${pathPipe}`);
    return resp.sendFile(multimedia);
    // '../dist/uploads/6043f3fe57751d03f033beb2/6043f3fe57751d03f033beb2-336/portada.png'
});
// ==================================================================== //
// obtener negocio por id
// ==================================================================== //
negocio.get('/getOne', (req, resp) => {
    // const id = req.params.id;
    const id = req.query.id;
    negocio_1.default.findById(id, (err, negocioDB) => {
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error al buscar negocio`,
                err
            });
        }
        else {
            return resp.json({
                ok: true,
                mensaje: `Negocio encontrado`,
                negocioDB
            });
        }
    });
});
// ==================================================================== //
// Busqueda de negocios
// ==================================================================== //  
negocio.get('/busqueda', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const ubicacion = req.query.ubicacion;
    const categoria = req.query.categoria;
    const cantidad = req.query.cantidad;
    return filtros.default.filtroBusqueda(ubicacion, categoria, cantidad, req, resp);
}));
// ==================================================================== //
// Eliminar un negocio
// ==================================================================== //
negocio.delete('/eliminarNegocio', (req, resp) => {
    const idNegocio = req.get('idNegocio');
    const idUsuario = req.get('idUsuario');
    const pathNegocioDB = req.get('pathNegocio');
    const pathNegocio = path_1.default.resolve(__dirname, `../uploads/${idUsuario}/${pathNegocioDB}`);
    console.log(idNegocio, idUsuario, pathNegocioDB);
    // verificar si el usuario tiene archivos en uploads y borrarlos si los encuentra
    const promesaBorarArchivos = new Promise((resolve, reject) => {
        if (fs_1.default.existsSync(pathNegocio)) {
            rimraf_1.default(`${pathNegocio}`, (err) => {
                if (err) {
                    reject(`No se pudieron borrar los archivos`);
                }
                else {
                    resolve(`Archivos borrados`);
                }
            });
        }
        else {
            reject(`No existen archivos para este negocio`);
        }
    });
    // verificar si el usuario tiene registros en base de datos
    const promesaBorrarRegistros = new Promise((resolve, reject) => {
        negocio_1.default.deleteOne({ _id: idNegocio }).then((negocioDB) => {
            resolve(negocioDB);
        }).catch((err) => {
            reject(err);
        });
    });
    // resolver las promesas
    Promise.all([promesaBorarArchivos, promesaBorrarRegistros])
        .then(data => {
        return resp.json({
            ok: true,
            mensaje: `Negocio borrado`,
            data
        });
    }).catch(err => {
        return resp.json({
            ok: false,
            mensaje: `Error al borrar el negocio`,
            err
        });
    });
});
// ==================================================================== //
// Editar un negocio
// ==================================================================== //
negocio.put('/editarNegocio', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const idNegocio = req.get('idNegocio');
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const monto = req.body.monto;
    const query = { _id: idNegocio };
    const updateNegocio = yield negocio_1.default.findOneAndUpdate(query, { nombre: nombre, descripcion: descripcion, monto: monto }, { new: true });
    if (!updateNegocio) {
        return resp.json({
            ok: false,
            mensaje: `Error al actualizar el negocio`
        });
    }
    else {
        return resp.json({
            ok: true,
            mensaje: `Negocio actualizado`
        });
    }
}));
exports.default = negocio;
