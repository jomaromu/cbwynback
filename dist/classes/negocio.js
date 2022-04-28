"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class NegocioClass {
    constructor() {
        // propiedades de la clase
        this.imagenes = [];
    }
    // metodos de la clase
    transformaImgs(imgs, idUusuario) {
        const miliseconds = new Date().getMilliseconds();
        const pathLogo = path_1.default.resolve(__dirname, '../assets/logocbwyn.png');
        const pathLogoPortada = path_1.default.resolve(__dirname, '../assets/logocbwyn.png');
        const pathVideo = path_1.default.resolve(__dirname, '../assets/videocbwyn.mp4');
        const rutaUsuario = path_1.default.resolve(__dirname, `../uploads/${idUusuario}`);
        // const rutaNegocio = path.resolve(__dirname, `../uploads/${idUusuario}/${idUusuario}-${miliseconds}`);
        const rutanegocioCorta = `${idUusuario}-${miliseconds}`;
        const rutaNegocio = path_1.default.resolve(__dirname, `../uploads/${idUusuario}/${rutanegocioCorta}`);
        console.log(pathLogoPortada);
        // logo
        const promesaLogo = new Promise((resolve, reject) => {
            if (!(imgs === null || imgs === void 0 ? void 0 : imgs.logo)) { // si no viene un logo
                // mover el logo default
                if (!fs_1.default.existsSync(rutaNegocio)) { // si no existe la ruta
                    fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        // console.log('no existe - no viene');
                        if (err)
                            throw err;
                        fs_1.default.copyFileSync(`${pathLogo}`, `${rutaNegocio}/logo.png`);
                        resolve(`${rutaNegocio}/logo.png`);
                    });
                }
                else { // si ya existe
                    // console.log('existe - no viene');
                    fs_1.default.copyFileSync(`${pathLogo}`, `${rutaNegocio}/logo.png`);
                    resolve(`${rutaNegocio}/logo.png`);
                }
            }
            else { // si viene el logo
                const logo = imgs.logo;
                // mover el logo a carpeta
                if (!fs_1.default.existsSync(rutaNegocio)) {
                    // console.log('no existe - viene');
                    fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err)
                            throw err;
                        logo.mv(`${rutaNegocio}/logo.png`, (err) => {
                            if (err)
                                throw err;
                            resolve(`${rutaNegocio}/logo.png`);
                        });
                    });
                }
                else {
                    // console.log('existe - viene');
                    logo.mv(`${rutaNegocio}/logo.png`, (err) => {
                        if (err)
                            throw err;
                        resolve(`${rutaNegocio}/logo.png`);
                    });
                }
            }
        });
        // portada
        const promesaPortada = new Promise((resolve, reject) => {
            if (!(imgs === null || imgs === void 0 ? void 0 : imgs.portada)) { // si no viene un portada
                // mover el portada default
                if (!fs_1.default.existsSync(rutaNegocio)) { // si no existe la ruta
                    fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err)
                            throw err;
                        fs_1.default.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/portada.png`);
                        resolve(`${rutaNegocio}/portada.png`);
                    });
                }
                else { // si ya existe
                    fs_1.default.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/portada.png`);
                    resolve(`${rutaNegocio}/portada.png`);
                }
            }
            else { // si viene el portada
                const portada = imgs.portada;
                // mover la portada a carpeta
                if (!fs_1.default.existsSync(rutaNegocio)) {
                    fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err)
                            throw err;
                        portada.mv(`${rutaNegocio}/portada.png`, (err) => {
                            if (err)
                                throw err;
                            resolve(`${rutaNegocio}/portada.png`);
                        });
                    });
                }
                else {
                    portada.mv(`${rutaNegocio}/portada.png`, (err) => {
                        if (err)
                            throw err;
                        resolve(`${rutaNegocio}/portada.png`);
                    });
                }
            }
        });
        // video
        const promesaVideo = new Promise((resolve, reject) => {
            if (!(imgs === null || imgs === void 0 ? void 0 : imgs.video)) { // si no viene un logo
                // mover el video default
                if (!fs_1.default.existsSync(rutaNegocio)) { // si no existe la ruta
                    fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err)
                            throw err;
                        fs_1.default.copyFileSync(`${pathVideo}`, `${rutaNegocio}/video.mp4`);
                        resolve(`${rutaNegocio}/video.mp4`);
                    });
                }
                else { // si ya existe
                    fs_1.default.copyFileSync(`${pathVideo}`, `${rutaNegocio}/video.mp4`);
                    resolve(`${rutaNegocio}/video.mp4`);
                }
            }
            else { // si viene el video
                const video = imgs.video;
                const ext = video.mimetype;
                // mover el video a carpeta
                if (!fs_1.default.existsSync(rutaNegocio)) {
                    fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err)
                            throw err;
                        video.mv(`${rutaNegocio}/video.${ext}`, (err) => {
                            if (err)
                                throw err;
                            resolve(`${rutaNegocio}/video.mp4`);
                        });
                    });
                }
                else {
                    video.mv(`${rutaNegocio}/video.${ext}`, (err) => {
                        if (err)
                            throw err;
                        resolve(`${rutaNegocio}/video.mp4`);
                    });
                }
            }
        });
        // docs
        const promesaDocs = new Promise((resolve, reject) => {
            const docs = imgs.docs;
            const name = docs.name;
            const partes = name.split('.');
            const ext = partes[partes.length - 1];
            // mover el docs a carpeta
            if (!fs_1.default.existsSync(rutaNegocio)) {
                fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                    if (err)
                        throw err;
                    docs.mv(`${rutaNegocio}/docs.${ext}`, (err) => {
                        if (err)
                            throw err;
                        resolve(`${rutaNegocio}/docs.${ext}`);
                    });
                });
            }
            else {
                docs.mv(`${rutaNegocio}/docs.${ext}`, (err) => {
                    if (err)
                        throw err;
                    resolve(`${rutaNegocio}/docs.${ext}`);
                });
            }
        });
        // // img
        const promesaImgs = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const arrayImg = [];
            const arrayResolve = [];
            arrayImg.push(imgs.img);
            // cuando no viene imagen
            if (!imgs.img) {
                for (let i = 0; i < 3; i++) {
                    // mover el logo default
                    if (!fs_1.default.existsSync(rutaNegocio)) { // si no existe la ruta
                        fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                            if (err)
                                reject(err);
                            fs_1.default.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${i}.png`);
                            arrayResolve.push(`${rutaNegocio}/img${i}.png`);
                            resolve(arrayResolve);
                        });
                    }
                    else { // si ya existe
                        fs_1.default.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${i}.png`);
                        arrayResolve.push(`${rutaNegocio}/img${i}.png`);
                        resolve(arrayResolve);
                    }
                }
            }
            // cuando viene imagen y no es un array
            if (imgs.img !== undefined && imgs.img !== null && !Array.isArray(imgs.img)) {
                if (!Array.isArray(imgs.img)) {
                    // console.log('no es un array');
                    // subir los logos
                    for (let i = 0; i < 3; i++) {
                        if (!fs_1.default.existsSync(rutaNegocio)) {
                            fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                                if (err)
                                    reject(err);
                                fs_1.default.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${i}.png`);
                                arrayResolve.push(`${rutaNegocio}/img${i}.png`);
                                resolve(arrayResolve);
                            });
                        }
                        else {
                            fs_1.default.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${i}.png`);
                            arrayResolve.push(`${rutaNegocio}/img${i}.png`);
                            resolve(arrayResolve);
                        }
                    }
                    // subir las img
                    if (!fs_1.default.existsSync(rutaNegocio)) {
                        fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                            if (err)
                                reject(err);
                            imgs.img.mv(`${rutaNegocio}/img2.png`, (err) => {
                                if (err)
                                    reject(err);
                                arrayResolve.push(`${rutaNegocio}/img2.png`);
                                resolve(arrayResolve);
                            });
                        });
                    }
                    else {
                        imgs.img.mv(`${rutaNegocio}/img2.png`, (err) => {
                            if (err)
                                reject(err);
                            arrayResolve.push(`${rutaNegocio}/img2.png`);
                            resolve(arrayResolve);
                        });
                    }
                }
            }
            // cuando viene una imagen y es una array
            if (imgs.img !== undefined && imgs.img !== null && Array.isArray(imgs.img)) {
                if (Array.isArray(imgs.img)) {
                    // console.log('es un array');
                    for (let j = 0; j < 3; j++) {
                        // cuando alguna es undefined
                        if (imgs.img[j] === undefined) {
                            // mover el logo default
                            if (!fs_1.default.existsSync(rutaNegocio)) { // si no existe la ruta
                                fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                                    if (err)
                                        reject(err);
                                    fs_1.default.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${j}.png`);
                                    arrayResolve.push(`${rutaNegocio}/img${j}.png`);
                                    resolve(arrayResolve);
                                });
                            }
                            else { // si ya existe
                                fs_1.default.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${j}.png`);
                                arrayResolve.push(`${rutaNegocio}/img${j}.png`);
                                resolve(arrayResolve);
                            }
                        }
                        else if (imgs.img[j] !== undefined) {
                            // subir las img
                            if (!fs_1.default.existsSync(rutaNegocio)) {
                                fs_1.default.mkdir(rutaNegocio, { recursive: true }, (err) => {
                                    if (err)
                                        reject(err);
                                    imgs.img[j].mv(`${rutaNegocio}/img${j}.png`, (err) => {
                                        if (err)
                                            reject(err);
                                    });
                                    arrayResolve.push(`${rutaNegocio}/img${j}.png`);
                                    resolve(arrayResolve);
                                });
                            }
                            else {
                                imgs.img[j].mv(`${rutaNegocio}/img${j}.png`, (err) => {
                                    if (err)
                                        reject(err);
                                });
                                arrayResolve.push(`${rutaNegocio}/img${j}.png`);
                                resolve(arrayResolve);
                            }
                        }
                    }
                }
            }
        }));
        return Promise.all([promesaLogo, promesaPortada, promesaVideo, promesaDocs, promesaImgs])
            .then((data) => {
            const objNegocio = {
                data,
                rutaNegocio,
                rutaUsuario,
                rutanegocioCorta
            };
            return objNegocio;
        }).catch((err) => {
            return err;
        });
    } // fin de transformaImgs
}
exports.default = NegocioClass;
