import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const rolesValidos = {
    values: ['CBWYNROLE', 'ADMINROLE'],
    message: '{VALUE}, no es un role permitido'
}

// crear esquema
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    // id por defecto
    nombre: { type: String, required: false },
    apellido: { type: String, required: false },
    role: { type: String, required: [true, 'El role es necesario'], enum: rolesValidos },
    correo: { type: String, required: [true, 'El correo es necesario'], unique: true }, //unique
    password: { type: String, required: [true, 'El password es necesario'] },
    telefono: { type: String, required: false },
    avatar: { type: String, required: false },
    fechaAlta: { type: Date, required: false },
    estado: { type: Boolean, required: [true, 'El usuario debe tener un estado: Activo/Inactivo'], default: true },
});

// validacion para unico elemento
usersSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe!!'});

// module.exports = mongoose.model('Usuario', usersSchema);
export = mongoose.model('Usuario', usersSchema);