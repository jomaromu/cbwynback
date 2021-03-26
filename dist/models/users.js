"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const rolesValidos = {
    values: ['CBWYNROLE', 'ADMINROLE'],
    message: '{VALUE}, no es un role permitido'
};
// crear esquema
const Schema = mongoose_1.default.Schema;
const usersSchema = new Schema({
    // id por defecto
    nombre: { type: String, required: false },
    apellido: { type: String, required: false },
    role: { type: String, required: [true, 'El role es necesario'], enum: rolesValidos },
    correo: { type: String, required: [true, 'El correo es necesario'], unique: true },
    password: { type: String, required: [true, 'El password es necesario'] },
    telefono: { type: String, required: false },
    avatar: { type: String, required: false },
    fechaAlta: { type: Date, required: false },
    estado: { type: Boolean, required: [true, 'El usuario debe tener un estado: Activo/Inactivo'], default: true },
});
// validacion para unico elemento
usersSchema.plugin(mongoose_unique_validator_1.default, { message: 'El {PATH} ya existe!!' });
module.exports = mongoose_1.default.model('Usuario', usersSchema);
