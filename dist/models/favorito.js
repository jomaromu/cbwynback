"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
// crear el esquema
const Schema = mongoose_1.default.Schema;
const favorito = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    negocio: { type: Schema.Types.ObjectId, ref: 'Negocio' },
});
module.exports = mongoose_1.default.model('Favorito', favorito);
