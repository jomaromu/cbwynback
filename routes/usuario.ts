import { Router, Request, Response } from 'express';
import { Error, Query } from 'mongoose';
import Server from '../classes/server';
import path from 'path';

import jwt from 'jsonwebtoken';
import { objetoEnviroment } from '../global/enviroment';

// esquemas - modelo
import User from '../models/users';
import Negocio from '../models/negocio';
import UsuarioClass from '../classes/usuario';

// instanciar clase negocio
const usuarioClass = new UsuarioClass();

// instanciar el router
const usuario = Router();

// ==================================================================== //
// ruta principal
// ==================================================================== //
usuario.get('/', (req: Request, resp: Response) => {

    return resp.json({
        ok: true,
        mensaje: 'Rutas de los usuarios'
    });
});

// ==================================================================== //
// registrar un usuario
// ==================================================================== //
usuario.post('/registrar', async (req: Request, resp: Response) => {

    // crear eschema del usuario
    const usuarioRegistrar = new User({
        correo: req.body.correo,
        password: req.body.password,
        soyMayor: req.body.soyMayor,
        fechaAlta: req.body.fechaAlta,
        role: req.body.role,
    });

    usuarioRegistrar.save((err, usuarioDB) => {

        if (err) {
            return resp.json({
                ok: false,
                mensaje: `No se pudo crear el usuario, ${err.message}`,
                err
            });
        } else {

            return resp.json({
                ok: true,
                usuarioDB
            });
        }

    });
});

// ==================================================================== //
// loguear un usuario
// ==================================================================== //
usuario.post('/entrar', (req: Request, resp: Response) => {

    const correo = req.body.correo;
    const password = req.body.password;
    let token = null;

    User.findOne({ correo: correo, password: password }, (err: Error, usuarioDB: Query<any, any>) => {

        // error interno
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error, ${err}`,
                err
            });
        }

        // error al no encontrar usuario
        if (!usuarioDB) {

            return resp.json({
                ok: false,
                mensaje: `Usuario incorrecto o no existe`
            });
        } else {

            // crear objeto jwt
            token = jwt.sign({ usuarioDB }, objetoEnviroment.claveToken, { expiresIn: 60 * 60 });

            // si existe el usuario
            return resp.json({
                ok: true,
                mensaje: `Acceso correcto`,
                usuarioDB,
                token
            });
        }

    })
});

// ==================================================================== //
// decodificar token
// ==================================================================== //
usuario.get('/decodedToken', (req: Request, resp: Response) => {

    const token = req.get('token');

    // decodificar token y enviar respuesta
    jwt.verify(`${token}`, objetoEnviroment.claveToken, (err, usuarioDBToken) => {

        if (err) {
            return resp.json({
                ok: false,
                mensaje: `No se pudo verificar el token`,
                err
            });
        } else {
            return resp.json({
                ok: true,
                usuarioDBToken
            });
        }
    })
});

// ==================================================================== //
// obtener un usuario por ID
// ==================================================================== //
usuario.get('/getUserId', (req: Request, resp: Response) => {

    const id = req.get('id');
    let token = null;

    User.findById({ _id: id }, (err: Error, usuarioDB: Query<any, any>) => {

        // error interno
        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error, ${err}`,
                err
            });
        }

        // error al no encontrar usuario
        if (!usuarioDB) {

            return resp.json({
                ok: false,
                mensaje: `Usuario incorrecto o no existe`
            });
        } else {

            // crear objeto jwt
            token = jwt.sign({ usuarioDB }, objetoEnviroment.claveToken, { expiresIn: 60 * 60 });

            // si existe el usuario
            return resp.json({
                ok: true,
                mensaje: `Acceso correcto`,
                usuarioDB,
                token
            });
        }
    });
});

// ==================================================================== //
// obtener negocios por ID del usuario
// ==================================================================== //
usuario.get('/negociosUsuario', (req: Request, resp: Response) => {

    const id = req.get('id');

    Negocio.find({ usuario: id }, (err: Error, negocioDB: Query<any, any>) => {

        if (err) {
            resp.json({
                ok: false,
                mensaje: `Error al buscar proyectos de este usuario`,
                err
            });
        } else {
            resp.json({
                ok: true,
                mensaje: `Búsuqueda correcta`,
                negocioDB
            });
        }
    });
});

// ==================================================================== //
// Actualizar un usuario
// ==================================================================== //
usuario.put('/actualizarPerfil', async (req: Request, resp: Response) => {

    const idUsuario = req.body.idUsuario;
    const idSocket = req.get('idSocket');
    // console.log(idSocket);
    // console.log(req.body);
    // console.log(req.files?.avatar);

    const id = req.body.idUsuario;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;

    const rutaAvatar = await usuarioClass.transformaImgs(req.files, id);
    const avatar = rutaAvatar.data[0];
    // console.log(avatar);

    User.findByIdAndUpdate(id, { nombre, apellido, avatar }, { new: true }, (err: any, usuarioDB) => {

        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error interno`
            });

        } else {

            const server = Server.instance;

            // server.io.emit('actualizar-perfil', usuarioDB);
            server.io.to(`${idSocket}`).emit('actualizar-perfil', usuarioDB);

            resp.json({
                ok: true,
                mensaje: `Perfil acutalizado`
            });
        }

    })

});

// ==================================================================== //
// obtener avatar para perfil
// ==================================================================== //
usuario.get('/getMultimediaAll', (req: Request, resp: Response) => {

    const pathPipe = req.query.multi;

    // const multimedia = path.resolve(`../uploads/${pathPipe}`);
    const multimedia = path.resolve(__dirname, `../uploads/${pathPipe}`);
    return resp.sendFile(multimedia);
    // '../dist/uploads/6043f3fe57751d03f033beb2/6043f3fe57751d03f033beb2-336/portada.png'
}); 

export default usuario;