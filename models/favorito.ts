import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// crear el esquema
const Schema = mongoose.Schema;

const favorito = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    negocio: { type: Schema.Types.ObjectId, ref: 'Negocio' },
});

export = mongoose.model('Favorito', favorito);