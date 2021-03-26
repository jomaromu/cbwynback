import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// crear el esquema
const Schema = mongoose.Schema;

const neogcioSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
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
    img: { type: Array },
    video: { type: Array },
    docs: { type: Array },
    codigoTel: { type: String },
    numeroTel: { type: Number },
    pagWeb: { type: String },
    estado: { type: Boolean, default: true },
    rutaNegocio: { type: String },
    rutaUsuario: { type: String },
    rutaCorta: { type: String },
});

export = mongoose.model('Negocio', neogcioSchema);