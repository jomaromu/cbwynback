import { Router, Request, Response } from 'express';
import { Error, Query } from 'mongoose';
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

// esquemas - modelo
import Negocio from '../models/negocio';
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
        rutaCorta: rutas.rutanegocioCorta
    });

    // guardar el negocio
    nuevoNegocio.save((err, negocioDB) => {

        // error interno
        if (err) {
            return resp.json({
                ok: false,
                mensaje: 'Error al crear negocio',
                err
            });

            // si todo va bien
        } else {
            return resp.json({
                ok: true,
                mensaje: 'Negocio creado',
                negocioDB
            });
        }



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
    });
});

// ==================================================================== //
// obtener multimedia para todos
// ==================================================================== //
negocio.get('/getMultimediaAll', (req: Request, resp: Response) => {

    const pathPipe = req.query.multi;

    // const multimedia = path.resolve(`../dist/${pathPipe}`);
    const multimedia = path.resolve(__dirname, `../${pathPipe}`);
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
export default negocio; 