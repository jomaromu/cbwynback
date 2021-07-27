"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const enviroment_1 = require("./global/enviroment");
// rutas
const rutaPrincipal_1 = __importDefault(require("./routes/rutaPrincipal"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const negocio_1 = __importDefault(require("./routes/negocio"));
const visa_1 = __importDefault(require("./routes/visa"));
// instancia del servidor 
const server = server_1.default.instance;
// body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// file upload
server.app.use(express_fileupload_1.default());
// cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
// conexion a base de datos
const uriDB = 'mongodb+srv://cybDB:12345678Mm&@cbwyndb-clouster.9tgic.mongodb.net/cybDB?retryWrites=true&w=majority';
// mongoose.connect(uriDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err) => {
//     if (err) throw err;
//     console.log('Base de datos online');
// });
// conexion local
mongoose_1.default.connect('mongodb://127.0.0.1:27017/cbyDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos Online');
});
// usar las rutas
server.app.use('/', rutaPrincipal_1.default);
server.app.use('/usuario', usuario_1.default);
server.app.use('/negocio', negocio_1.default);
server.app.use('/visa', visa_1.default);
// correr el servidor
server.start(() => {
    console.log(`Servidor corriendo en el puerto: ${enviroment_1.objetoEnviroment.port}`);
});
