"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
// crear el esquema
const Schema = mongoose_1.default.Schema;
const proyectSchema = new Schema({
    nombre: { type: String },
    descripcion: { type: String },
    tipoNegocio: { type: String },
    tiempo: { type: String },
    monto: { type: Number },
    categoria: { type: String },
    ubicacion: { type: String },
    utilidad: { type: String },
    retorno: { type: Number },
    garantia: { type: String },
    otras: { type: String },
    logo: { type: Array },
    portada: { type: Array },
    img1: { type: Array },
    img2: { type: Array },
    img3: { type: Array },
    video: { type: Array },
    docs: { type: Array },
    codigoTel: { type: String },
    numeroTel: { type: Number },
    pagWeb: { type: String },
});
module.exports = mongoose_1.default.model('Proyecto', proyectSchema);
