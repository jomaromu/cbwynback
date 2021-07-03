import Server from './classes/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';


import { objetoEnviroment } from './global/enviroment';

// rutas
import routerPrincipal from './routes/rutaPrincipal';
import usuario from './routes/usuario';
import negocio from './routes/negocio';
import visa from './routes/visa';

// instancia del servidor 
const server = new Server;

// body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// file upload
server.app.use(fileUpload());

// cors
server.app.use(cors({ origin: true, credentials: true }));
 
// conexion a base de datos
const uriDB = 'mongodb+srv://cybDB:12345678Mm&@cbwyndb-clouster.9tgic.mongodb.net/cybDB?retryWrites=true&w=majority';
mongoose.connect(uriDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err) => {
    if (err) throw err;
    console.log('Base de datos online');
});

// conexion local
// mongoose.connect('mongodb://127.0.0.1:27017/cbyDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err) => {
//     if (err) throw err;
//     console.log('Base de datos Online');
// });
 
// usar las rutas
server.app.use('/', routerPrincipal);
server.app.use('/usuario', usuario);
server.app.use('/negocio', negocio);
server.app.use('/visa', visa);

// correr el servidor
server.start(() => {
    console.log(`Servidor corriendo en el puerto: ${objetoEnviroment.port}`);
});
