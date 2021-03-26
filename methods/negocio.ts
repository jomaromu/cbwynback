import { Error, Query } from 'mongoose';
import { Request, Response } from 'express';

import Negocio from '../models/negocio';

// criterios de busqueda
const filtroBusqueda = (ubicacion: any, categoria: any, cantidad: any, req: Request, resp: Response) => {
    console.log('cantidad: ' + cantidad, 'ubicacion: ' + ubicacion, 'categoria: ' + categoria);

    let nuevaCant = cantidad;
    let nuevaUb = ubicacion;
    let nuevaCat = ubicacion;

    let inicioCant = 0;
    let finCant = 0;

    // caso cantidad
    if (cantidad === 'null' || !cantidad) {
        nuevaCant = undefined;
    } else if (nuevaCant !== 'null') {
        // const nuevaC = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(Number(cantidad));
        nuevaCant = Number(cantidad);

        // caso 1
        if (nuevaCant === 1) {
            inicioCant = 0;
            finCant = 999;
        }

        // caso 2
        if (nuevaCant === 2) { 
            inicioCant = 1000;
            finCant = 99999;
        }

        // caso 3
        if (nuevaCant === 3) {
            inicioCant = 100000;
            finCant = 9999999999
        }
    }

    // caso categoria
    if (categoria === 'null' || !categoria) {
        nuevaCat = undefined;
    } else if (categoria !== 'null') {
        nuevaCat = categoria;
    }
    // caso ubicacion
    if (ubicacion === 'null' || !ubicacion) {
        nuevaUb = undefined;
    } else if (ubicacion !== 'null') {
        nuevaUb = ubicacion;
    }

    // 1. solo pais
    if (nuevaUb && (!nuevaCat && !nuevaCant)) {
        Negocio.find({ 'ubicacion': nuevaUb }, (err: Error, negocioDB: Query<any, any>) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar negocio/s para Ubicación ${nuevaUb}`,
                    err
                });
            } else {
                return resp.json({
                    ok: true,
                    mensaje: `Búsqueda correcta`,
                    negocioDB
                });
            }
        });
    }
    // 2. solo categoria
    if (nuevaCat && (!nuevaUb && !nuevaCant)) {
        Negocio.find({ 'categoria': nuevaCat }, (err: Error, negocioDB: Query<any, any>) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar negocio/s para Categoria ${nuevaCat}`,
                    err
                });
            } else {
                return resp.json({
                    ok: true,
                    mensaje: `Búsqueda correcta`,
                    negocioDB
                });
            }
        });
    }
    // 3. solo cantidad
    if (nuevaCant && (!nuevaCat && !nuevaUb)) {
        Negocio.find({ $and: [{ 'monto': { $gte: inicioCant } }, { 'monto': { $lte: finCant } }] }, (err: Error, negocioDB: Query<any, any>) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar negocio para Monto ${nuevaCant}`,
                    err
                });
            } else {
                return resp.json({
                    ok: true,
                    mensaje: `Búsqueda correcta`,
                    negocioDB
                });
            }
        });
    }
    // 4. pais y categoria
    if (nuevaUb && nuevaCat && !nuevaCant) {
        Negocio.find({ $and: [{ 'ubicacion': nuevaUb }, { 'categoria': nuevaCat }] }, (err: Error, negocioDB: Query<any, any>) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar negocio por Ubicación y Categoría`,
                    err
                });
            } else {
                return resp.json({
                    ok: true,
                    mensaje: `Búsqueda correcta`,
                    negocioDB
                });
            }
        });
    }
    // 5. categoria y cantidad
    if (nuevaCat && nuevaCant && !nuevaUb) {
        Negocio.find({ $and: [{ 'categoria': nuevaCat }, { $and: [{ 'monto': { $gte: inicioCant } }, { 'monto': { $lte: finCant } }] }] }, (err: Error, negocioDB: Query<any, any>) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar negocio por Categoria y Cantidad`,
                    err
                });
            } else {
                return resp.json({
                    ok: true,
                    mensaje: `Búsqueda correcta`,
                    negocioDB
                });
            }
        });
    }
    // 6. pais y cantidad
    if (nuevaUb && nuevaCant && !nuevaCat) {
        Negocio.find({ $and: [{ 'ubicacion': nuevaUb }, { $and: [{ 'monto': { $gte: inicioCant } }, { 'monto': { $lte: finCant } }] }] }, (err: Error, negocioDB: Query<any, any>) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar negocio por Ubicación y Cantidad`,
                    err
                });
            } else {
                return resp.json({
                    ok: true,
                    mensaje: `Búsqueda correcta`,
                    negocioDB
                });
            }
        });
    }
    // 7. cuando no viene ninguno
    if (!nuevaUb && !nuevaCant && !nuevaCat) {
        Negocio.find({}, (err: Error, negocioDB: Query<any, any>) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error al búscar negocios`,
                    err
                });
            } else {
                return resp.json({
                    ok: true,
                    mensaje: `Búsqueda correcta`,
                    negocioDB
                });
            }
        });
    }
}


export default {
    filtroBusqueda
}