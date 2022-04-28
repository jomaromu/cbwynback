import { Router, Request, Response, response } from 'express';
import { Error, Query } from 'mongoose';
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import moment from 'moment';
import { createTransport } from 'nodemailer';
const hbs = require('nodemailer-express-handlebars');

// esquemas - modelo
import Negocio from '../models/negocio';
import Favorito from '../models/favorito';
import NegocioClass from '../classes/negocio';

// metodos
import * as filtros from '../methods/negocio';

// instanciar el router
const negocio = Router();

// instanciar clase negocio
const negocioClass = new NegocioClass;

// ==================================================================== //
// crear un negocio
// ==================================================================== //
negocio.post('/nuevoNegocio', async (req: Request, resp: Response) => {

    const rutas = await negocioClass.transformaImgs(req.files, req.body.usuario);

    const crearNegocio = new Promise(async (resolve, reject) => {

        const fecha = moment().format('l');

        const nuevoNegocio = new Negocio({
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
            logo: rutas.data[0],
            portada: rutas.data[1],
            img: rutas.data[4],
            video: rutas.data[2],
            docs: rutas.data[3],
            codigoTel: req.body.codigoTel,
            numeroTel: req.body.numeroTel,
            pagWeb: req.body.pagWeb,
            usuario: req.body.usuario,
            rutaNegocio: rutas.rutaNegocio,
            rutaUsuario: rutas.rutaUsuario,
            rutaCorta: rutas.rutanegocioCorta,
            fechaAlta: fecha
        });

        // guardar el negocio
        nuevoNegocio.save((err, negocioDB: any) => {

            const objNegocioCreado = {
                ok: false,
                mensaje: '',
                negocioDB: {}
            }

            if (err) {

                objNegocioCreado.ok = false;
                objNegocioCreado.mensaje = 'Error al crearl el negocio';

                reject(objNegocioCreado);

            } else {

                // objNegocioCreado.ok = true;
                // objNegocioCreado.mensaje = 'Negocio creado';
                // objNegocioCreado.negocioDB = negocioDB

                // ================================ //
                // empieza notificacion
                // ================================ //

                const splitDoc: any[] = negocioDB.docs[0].split('\\');
                const pathNegocio = `${splitDoc[splitDoc.length - 2]}/${splitDoc[splitDoc.length - 1]}`;

                const nombreUsuario = req.body.nombreUsuario;
                const apellidoUsuario = req.body.apellidoUsuario;
                const correoUsuario = req.body.correoUsuario;
                const idNegocio = negocioDB._id;
                const rutaNegocio = pathNegocio;
                const codigoTel = negocioDB.codigoTel;
                const numeroTel = negocioDB.numeroTel;

                // console.log(rutaNegocio);

                const transp = createTransport({
                    host: "smtp.titan.email",
                    port: 465,
                    secure: true, // use TLS
                    auth: {
                        user: "noreply@cbwyn.com",
                        pass: "noreply2021"
                    }, tls: {
                        // do not fail on invalid certs
                        rejectUnauthorized: false
                    },
                });

                const options = {
                    viewEngine: {
                        extname: '.handlebars', // handlebars extension
                        layoutsDir: path.resolve(__dirname, '../views/'), // location of handlebars templates
                        defaultLayout: 'nuevo-negocio-notificacion', // name of main template
                        partialsDir: path.resolve(__dirname, '../views/'), // location of your subtemplates aka. header, footer etc
                    },
                    viewPath: path.resolve(__dirname, '../views/'),
                    extName: '.handlebars',
                };

                transp.use('compile', hbs(options));

                const mailOptions = {
                    from: `noreply@cbwyn.com`,
                    to: 'jomaromu2@gmail.com', // req.body.correoUsuario
                    // cc: 'noreply@cbwyn.com',
                    // to: 'info@cbwyn.com',
                    subject: `Nuevo negocio creado`,
                    template: 'nuevo-negocio-notificacion',
                    context: {
                        correo: req.body.correoUsuario,
                        nombreUsuario: nombreUsuario,
                        apellidoUsuario: apellidoUsuario,
                        correoUsuario: correoUsuario,
                        codigoTel: codigoTel,
                        numeroTel: numeroTel,

                        fecha: moment().format('l'),
                        enlace: `https://cbwyn.com//#/negocio?id=${idNegocio}`,
                        // enlace: `http://190.218.38.94/#/negocio?id=${idNegocio}`,
                        // numeroFactura: req.body.idNegocio
                    },
                    attachments: [
                        { filename: 'logo-final-portada.png', path: path.resolve(__dirname, '../assets/logo-final-portada.png'), cid: 'logo' },
                        { filename: 'docs.docx', path: path.resolve(__dirname, `../uploads/${rutaNegocio}`), cid: 'docsLegales' },
                    ]
                }

                transp.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        // console.log(err);
                        objNegocioCreado.ok = false;
                        objNegocioCreado.mensaje = 'Negocio creado (Sin notificación)';
                        reject(objNegocioCreado);
                    } else {
                        // console.log(info);
                        objNegocioCreado.ok = true;
                        objNegocioCreado.mensaje = 'Negocio crado (Con notificación)';
                        objNegocioCreado.negocioDB = negocioDB;
                        resolve(objNegocioCreado);
                    }
                });

                // ================================ //
                // termina notificacion
                // ================================ //
            }
        });
    });

    Promise.all([crearNegocio])
        .then((data: any) => {
            return resp.json({
                ok: true,
                mensaje: data.mensaje,
                data
            })
        }).catch(err => {
            return resp.json({
                ok: false,
                mensaje: err.mensaje
            });
        });
});

// ==================================================================== //
// obtener todos los negocios
// ==================================================================== //
negocio.get('/obtenerTodos', (req: Request, resp: Response) => {

    Negocio.find({ estado: true }, (err: Error, negocioDB: Query<any, any>) => {

        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err
            });

        } else {
            return resp.json({
                ok: true,
                mensaje: `Todos los negocios obtenidos`,
                negocioDB
            });
        }
    }).sort({ '_id': 'descending' });
});

// ==================================================================== //
// obtener multimedia para todos
// ==================================================================== //
negocio.get('/getMultimediaAll', (req: Request, resp: Response) => {

    const pathPipe = req.query.multi;

    // const multimedia = path.resolve(`../uploads/${pathPipe}`);
    const multimedia = path.resolve(__dirname, `../uploads/${pathPipe}`);
    // console.log(multimedia)
    return resp.sendFile(multimedia);

    // '../dist/uploads/6043f3fe57751d03f033beb2/6043f3fe57751d03f033beb2-336/portada.png'
});

// ==================================================================== //
// obtener negocio por id
// ==================================================================== //
negocio.get('/getOne', (req: Request, resp: Response) => {
    // const id = req.params.id;
    const id = req.query.id;

    Negocio.findById(id, (err: Error, negocioDB: Query<any, any>) => {

        if (err) {
            return resp.json({
                ok: false,
                mensaje: `Error al buscar negocio`,
                err
            });
        } else {
            return resp.json({
                ok: true,
                mensaje: `Negocio encontrado`,
                negocioDB
            })
        }
    });
});

// ==================================================================== //
// Busqueda de negocios
// ==================================================================== //  
negocio.get('/busqueda', async (req: Request, resp: Response) => {
    const ubicacion = req.query.ubicacion;
    const categoria = req.query.categoria;
    const cantidad = req.query.cantidad;

    return filtros.default.filtroBusqueda(ubicacion, categoria, cantidad, req, resp);
});

// ==================================================================== //
// Eliminar un negocio
// ==================================================================== //
negocio.delete('/eliminarNegocio', (req: Request, resp: Response) => {
    const idNegocio = req.get('idNegocio');
    const idUsuario = req.get('idUsuario');
    const pathNegocioDB = req.get('pathNegocio');
    const pathNegocio = path.resolve(__dirname, `../uploads/${idUsuario}/${pathNegocioDB}`);

    // console.log(idNegocio, idUsuario, pathNegocioDB);

    // verificar si el usuario tiene archivos en uploads y borrarlos si los encuentra
    const promesaBorarArchivos = new Promise((resolve, reject) => {
        if (fs.existsSync(pathNegocio)) {
            rimraf(`${pathNegocio}`, (err) => {
                if (err) {
                    reject(`No se pudieron borrar los archivos`);
                } else {
                    resolve(`Archivos borrados`);
                }
            });
        } else {
            reject(`No existen archivos para este negocio`)
        }
    });

    // verificar si el usuario tiene registros en base de datos
    const promesaBorrarRegistros = new Promise((resolve, reject) => {

        Negocio.deleteOne({ _id: idNegocio }).then((negocioDB) => {
            resolve(negocioDB);
        }).catch((err) => {
            reject(err);
        });
    });

    // resolver las promesas
    Promise.all([promesaBorarArchivos, promesaBorrarRegistros])
        .then(data => {
            return resp.json({
                ok: true,
                mensaje: `Negocio borrado`,
                data
            });
        }).catch(err => {
            return resp.json({
                ok: false,
                mensaje: `Error al borrar el negocio`,
                err
            });
        });

});
// ==================================================================== //
// Editar un negocio
// ==================================================================== //
negocio.put('/editarNegocio', async (req: Request, resp: Response) => {
    const idNegocio = req.get('idNegocio');
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const monto = req.body.monto;

    const query = { _id: idNegocio };

    const updateNegocio = await Negocio.findOneAndUpdate(query, { nombre: nombre, descripcion: descripcion, monto: monto }, { new: true });

    if (!updateNegocio) {
        return resp.json({
            ok: false,
            mensaje: `Error al actualizar el negocio`
        });
    } else {
        return resp.json({
            ok: true,
            mensaje: `Negocio actualizado`
        });
    }
});

// ==================================================================== //
// Obtener favoritos
// ==================================================================== //
negocio.get('/obtenerFavoritos', (req: Request, resp: Response) => {

    const idUsuario = req.get('idUsuario');

    Favorito.find({ usuario: idUsuario }, (err: Error, favoritosDB: Query<any, any>) => {

        if (err) {
            resp.json({
                ok: false,
                mensaje: 'Error al buscar favoritos',
                err
            });
        } else {
            resp.json({
                ok: true,
                mensaje: 'Existe(en) favorito(s) en la obtencion de favoritos',
                favoritosDB
            });
        }
    });
});

// ==================================================================== //
// Buscar favorito
// ==================================================================== //
negocio.post('/buscarFavorito', (req: Request, resp: Response) => {

    const idUsuario = req.body.idUsuario;
    const idNegocio = req.body.idNegocio;

    Favorito.findOne({ usuario: idUsuario, negocio: idNegocio }, (err: Error, favoritoDB: Query<any, any>) => {

        // error al buscar favorito
        if (err) {
            return resp.json({
                ok: false,
                mensaje: 'Error al buscar favorito',
                err
            });
        }

        // si no existe, crear favorito
        if (!favoritoDB) {
            return resp.json({
                ok: true,
                existe: false,
                mensaje: 'No existe un favorito'
            });
        }

        // si existe remover favorito
        return resp.json({
            ok: true,
            existe: true,
            mensaje: 'ya existe un favorito'
        });
    });
});

// ==================================================================== //
// Crear favorito
// ==================================================================== //
negocio.post('/crearFavorito', (req: Request, resp: Response) => {

    const idUsuario = req.body.idUsuario;
    const idNegocio = req.body.idNegocio;

    const favorito = new Favorito({
        usuario: idUsuario,
        negocio: idNegocio
    });

    // guardar registro favorito
    const registrarFavorito = new Promise((resolve, reject) => {
        favorito.save((err, favoritoDB) => {

            if (err) {
                reject('Error al crear favorito');
            } else {
                resolve('Favorito creado');
            }
        });
    });

    Promise.all([registrarFavorito])
        .then(respuesta => {
            resp.json({
                ok: true,
                mensaje: respuesta
            });
        }).catch(error => {
            resp.json({
                ok: false,
                mensaje: error
            });
        });
});

// ==================================================================== //
// Eliminar favorito
// ==================================================================== //
negocio.delete('/eliminarFavorito', async (req: Request, resp: Response) => {

    const idUsuario = req.get('idUsuario')
    const idNegocio = req.get('idNegocio');

    /*crear dos promesas
    1. eliminar favorito
    2. sacar del array de negocios el favorito  */

    const borrarFavorito = new Promise(async (resolve, reject) => {
        const borrado = await Favorito.deleteOne({ usuario: idUsuario, negocio: idNegocio });
        resolve(borrado);
    });

    // const eliminarIdUsuario = new Promise(async (resolve, reject) => {
    //     const actualizdo = await Negocio.findByIdAndUpdate({ _id: idNegocio }, { $pull: { 'favorito': idUsuario } }, { new: true });
    //     resolve(actualizdo);
    // });

    Promise.all([borrarFavorito])
        .then(data => {
            resp.json({
                ok: true,
                mensaje: 'Favorito borrado',
                data
            });
        }).catch(error => {
            resp.json({
                ok: false,
                mensaje: 'No se pudo borrar el favorito',
                error
            });
        })
});

// ==================================================================== //
// obtener docs
// ==================================================================== // 
negocio.get('/obtenerDoc', (req: Request, resp: Response) => {

    const pathNegocio = req.query.pathNegocio;
    // console.log(pathNegocio);

    // const partsNegocio = negocio.split('\\');
    // const rutaNegocio = `${partsNegocio[partsNegocio.length - 2]}/${partsNegocio[partsNegocio.length - 1]}`;
    // const rutaFinal = path.resolve(__dirname, `../uploads/${rutaNegocio}`);

    // return resp.sendFile(path.resolve(__dirname, '../uploads/60d1663712320f655cd36aa9/60d1663712320f655cd36aa9-453/docs.docx'));
    return resp.sendFile(path.resolve(__dirname, `../uploads/${pathNegocio}`));

});

// ==================================================================== //
// correo de compra de contacto a negocio
// ==================================================================== // 
negocio.post('/contactoNegocio', (req: Request, resp: Response) => {

    // console.log(req.body.pathNegocio);
    // console.log(req.body.idNegocio);

    /* 
    1. buscar el negocio basado en el id
    2. buscar su docs[0]
    3. separar la ruta
    4. buscar la ruta
    5. agregarla al correo
    6. hacer verificaciones tanto en path como en req.body
     */

    // return;

    const contactoInver = new Promise((resolve, reject) => {
        const transp = createTransport({
            host: "smtp.titan.email",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: "noreply@cbwyn.com",
                pass: "noreply2021"
            }, tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            },
        });

        const options = {
            viewEngine: {
                extname: '.handlebars', // handlebars extension
                layoutsDir: path.resolve(__dirname, '../views/'), // location of handlebars templates
                defaultLayout: 'negocio', // name of main template
                partialsDir: path.resolve(__dirname, '../views/'), // location of your subtemplates aka. header, footer etc
            },
            viewPath: path.resolve(__dirname, '../views/'),
            extName: '.handlebars',
        };

        transp.use('compile', hbs(options));

        const mailOptions = {
            from: `noreply@cbwyn.com`,
            to: `${req.body.correoUsuario}`, // req.body.correoUsuario
            // cc: 'noreply@cbwyn.com',
            // cc: 'info@cbwyn.com',
            subject: `Facturación cbwyn`,
            template: 'negocio',
            context: {
                correo: req.body.correoUsuario,
                fecha: moment().format('l'),
                enlace: `https://cbwyn.com//#/negocio?id=${req.body.idNegocio}`,
                numeroFactura: req.body.idNegocio
            },
            attachments: [
                { filename: 'logo-final-portada.png', path: path.resolve(__dirname, '../assets/logo-final-portada.png'), cid: 'logo' },
                { filename: 'facebook.png', path: path.resolve(__dirname, '../assets/facebook.png'), cid: 'facebook' },
                { filename: 'instagram.gif', path: path.resolve(__dirname, '../assets/instagram.png'), cid: 'instagram' },
                { filename: 'twitter.png', path: path.resolve(__dirname, '../assets/twitter.png'), cid: 'twitter' },
                { filename: 'docs.docx', path: path.resolve(__dirname, `../uploads/${req.body.pathNegocio}`), cid: 'docsLegales' },
            ]
        }

        transp.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });

    Promise.all([contactoInver])
        .then(respData => {
            return resp.json({
                ok: true,
                mensaje: 'Correo enviado',
                respData
            });
        }).catch(respErr => {
            return resp.json({
                ok: false,
                mensaje: 'Correo no enviado',
                respErr
            });
        });
});

// ==================================================================== //
// mensaje de la plataforma
// ==================================================================== // 
negocio.post('/contactoPlataforma', (req: Request, resp: Response) => {

    const objetoCorreo = {
        nombre: req.body.nombre,
        correo: req.body.correo,
        mensaje: req.body.mensaje
    }

    // console.log(objetoCorreo);

    const transp = createTransport({
        host: "smtp.titan.email",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "noreply@cbwyn.com",
            pass: "noreply2021"
        }, tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        },
    });

    const options = {
        viewEngine: {
            extname: '.handlebars', // handlebars extension
            layoutsDir: '../dist/views/', // location of handlebars templates
            defaultLayout: 'contacto', // name of main template
            partialsDir: '../dist/views/', // location of your subtemplates aka. header, footer etc
        },
        viewPath: '../dist/views/',
        extName: '.handlebars',
    };

    transp.use('compile', hbs(options));

    const mailOptions = {
        from: `noreply@cbwyn.com`,
        to: 'info@cbwyn.com',
        cc: 'jomaromu2@gmail.com',
        subject: `Mensaje desde cbwyn`,
        template: 'contacto',
        context: {
            nombre: objetoCorreo.nombre,
            correo: objetoCorreo.correo,
            mensaje: objetoCorreo.mensaje,
        },
        attachments: [
            { filename: 'logo-final-portada.png', path: path.resolve(__dirname, '../assets/logo-final-portada.png'), cid: 'logo' },
        ]
    }

    transp.sendMail(mailOptions, (err, info) => {
        if (err) {
            // console.log(err);
            resp.json({
                ok: false,
                mensaje: 'Correo no enviado',
                err
            });
        } else {
            // console.log(info);
            resp.json({
                ok: true,
                mensaje: 'Correo enviado',
                info
            });
        }
    });
});
export default negocio;