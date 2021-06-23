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
const moment_1 = __importDefault(require("moment"));
// esquemas - modelo
const negocio_1 = __importDefault(require("../models/negocio"));
const favorito_1 = __importDefault(require("../models/favorito"));
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
    const fecha = moment_1.default().format('l');
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
        rutaCorta: rutas.rutanegocioCorta,
        fechaAlta: fecha
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
    // const multimedia = path.resolve(`../dist/${pathPipe}`);
    const multimedia = path_1.default.resolve(__dirname, `../${pathPipe}`);
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
    // console.log(idNegocio, idUsuario, pathNegocioDB);
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
// ==================================================================== //
// Obtener favoritos
// ==================================================================== //
negocio.get('/obtenerFavoritos', (req, resp) => {
    const idUsuario = req.get('idUsuario');
    favorito_1.default.find({ usuario: idUsuario }, (err, favoritosDB) => {
        if (err) {
            resp.json({
                ok: false,
                mensaje: 'Error al buscar favoritos',
                err
            });
        }
        else {
            resp.json({
                ok: true,
                mensaje: 'Existe(en) favorito(s) en la obtencion de favoritos',
                favoritosDB
            });
        }
    });
});
// ==================================================================== //
// Buscar favorito
// ==================================================================== //
negocio.post('/buscarFavorito', (req, resp) => {
    const idUsuario = req.body.idUsuario;
    const idNegocio = req.body.idNegocio;
    favorito_1.default.findOne({ usuario: idUsuario, negocio: idNegocio }, (err, favoritoDB) => {
        // error al buscar favorito
        if (err) {
            return resp.json({
                ok: false,
                mensaje: 'Error al buscar favorito',
                err
            });
        }
        // si no existe, crear favorito
        if (!favoritoDB) {
            return resp.json({
                ok: true,
                existe: false,
                mensaje: 'No existe un favorito'
            });
        }
        // si existe remover favorito
        return resp.json({
            ok: true,
            existe: true,
            mensaje: 'ya existe un favorito'
        });
    });
});
// ==================================================================== //
// Crear favorito
// ==================================================================== //
negocio.post('/crearFavorito', (req, resp) => {
    const idUsuario = req.body.idUsuario;
    const idNegocio = req.body.idNegocio;
    const favorito = new favorito_1.default({
        usuario: idUsuario,
        negocio: idNegocio
    });
    // guardar registro favorito
    const registrarFavorito = new Promise((resolve, reject) => {
        favorito.save((err, favoritoDB) => {
            if (err) {
                reject('Error al crear favorito');
            }
            else {
                resolve('Favorito creado');
            }
        });
    });
    // actualizar los favoritos en el negocio
    // const actualizarFavoritoNegocio = new Promise(async (resolve, reject) => {
    //     const query = {
    //         _id: idNegocio,
    //     }
    //     const nuevoFavorito = await Negocio.findOneAndUpdate(query, { $push: { favorito: { idUsuario: idUsuario, idNegocio: idNegocio } } });
    //     if (!nuevoFavorito) {
    //         reject('No se pudo actualizar el negocio favorito');
    //     } else {
    //         resolve('Favorito agregado al negocio');
    //     }
    // });
    Promise.all([registrarFavorito])
        .then(respuesta => {
        resp.json({
            ok: true,
            mensaje: respuesta
        });
    }).catch(error => {
        resp.json({
            ok: false,
            mensaje: error
        });
    });
});
// ==================================================================== //
// Eliminar favorito
// ==================================================================== //
negocio.delete('/eliminarFavorito', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const idUsuario = req.get('idUsuario');
    const idNegocio = req.get('idNegocio');
    /*crear dos promesas
    1. eliminar favorito
    2. sacar del array de negocios el favorito  */
    const borrarFavorito = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const borrado = yield favorito_1.default.deleteOne({ usuario: idUsuario, negocio: idNegocio });
        resolve(borrado);
    }));
    // const eliminarIdUsuario = new Promise(async (resolve, reject) => {
    //     const actualizdo = await Negocio.findByIdAndUpdate({ _id: idNegocio }, { $pull: { 'favorito': idUsuario } }, { new: true });
    //     resolve(actualizdo);
    // });
    Promise.all([borrarFavorito])
        .then(data => {
        resp.json({
            ok: true,
            mensaje: 'Favorito borrado',
            data
        });
    }).catch(error => {
        resp.json({
            ok: false,
            mensaje: 'No se pudo borrar el favorito',
            error
        });
    });
}));
exports.default = negocio;
