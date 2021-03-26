"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// esquemas - modelo
const proyect_1 = __importDefault(require("../models/proyect"));
// instanciar el router
const proyecto = express_1.Router();
// ==================================================================== //
// crear un proyecto
// ==================================================================== //
proyecto.post('/nuevoProyecto', (req, resp) => {
    var _a, _b, _c, _d, _e, _f;
    console.log((_a = req.files) === null || _a === void 0 ? void 0 : _a.logo);
    const nuevoProyecto = new proyect_1.default({
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
        logo: (_b = req.files) === null || _b === void 0 ? void 0 : _b.logo,
        portada: (_c = req.files) === null || _c === void 0 ? void 0 : _c.portada,
        img: (_d = req.files) === null || _d === void 0 ? void 0 : _d.img,
        video: (_e = req.files) === null || _e === void 0 ? void 0 : _e.video,
        docs: (_f = req.files) === null || _f === void 0 ? void 0 : _f.docs,
        codigoTel: req.body.codigoTel,
        numeroTel: req.body.numeroTel,
        pagWeb: req.body.pagWeb
    });
    // guardar el proyecto
    nuevoProyecto.save((err, negocioDB) => {
        // error interno
        if (err) {
            return resp.json({
                ok: false,
                mensaje: 'Error al crear proyecto',
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
});
exports.default = proyecto;
