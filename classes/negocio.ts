import { FileArray } from 'express-fileupload';
import path from 'path';
import fs from 'fs';

export default class NegocioClass {

    // propiedades de la clase
    private imagenes: any[] = [];

    constructor() { }

    // metodos de la clase
    public transformaImgs(imgs: FileArray | undefined | any, idUusuario: String): any {


        const miliseconds = new Date().getMilliseconds();

        const pathLogo = path.resolve(__dirname, '../assets/logocbwyn.png');
        const pathLogoPortada = path.resolve(__dirname, '../assets/logocbwyn.png');
        const pathVideo = path.resolve(__dirname, '../assets/videocbwyn.mp4');

        const rutaUsuario = path.resolve(__dirname, `../uploads/${idUusuario}`);
        // const rutaNegocio = path.resolve(__dirname, `../uploads/${idUusuario}/${idUusuario}-${miliseconds}`);
        const rutanegocioCorta = `${idUusuario}-${miliseconds}`;
        const rutaNegocio = path.resolve(__dirname, `../uploads/${idUusuario}/${rutanegocioCorta}`);

        console.log(pathLogoPortada)
        // logo
        const promesaLogo = new Promise((resolve, reject) => {
            if (!imgs?.logo) { // si no viene un logo
                // mover el logo default
                if (!fs.existsSync(rutaNegocio)) { // si no existe la ruta
                    fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        // console.log('no existe - no viene');
                        if (err) throw err;
                        fs.copyFileSync(`${pathLogo}`, `${rutaNegocio}/logo.png`);
                        resolve(`${rutaNegocio}/logo.png`);
                    });
                } else { // si ya existe
                    // console.log('existe - no viene');
                    fs.copyFileSync(`${pathLogo}`, `${rutaNegocio}/logo.png`);
                    resolve(`${rutaNegocio}/logo.png`);
                }
            } else { // si viene el logo

                const logo = imgs.logo;

                // mover el logo a carpeta
                if (!fs.existsSync(rutaNegocio)) {
                    // console.log('no existe - viene');
                    fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err) throw err;
                        logo.mv(`${rutaNegocio}/logo.png`, (err: any) => {
                            if (err) throw err;
                            resolve(`${rutaNegocio}/logo.png`);
                        });
                    });
                } else {
                    // console.log('existe - viene');
                    logo.mv(`${rutaNegocio}/logo.png`, (err: any) => {
                        if (err) throw err;
                        resolve(`${rutaNegocio}/logo.png`);
                    });
                }
            }
        });

        // portada
        const promesaPortada = new Promise((resolve, reject) => {
            if (!imgs?.portada) { // si no viene un portada
                // mover el portada default
                if (!fs.existsSync(rutaNegocio)) { // si no existe la ruta
                    fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err) throw err;
                        fs.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/portada.png`);
                        resolve(`${rutaNegocio}/portada.png`);
                    });
                } else { // si ya existe
                    fs.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/portada.png`);
                    resolve(`${rutaNegocio}/portada.png`);
                }
            } else { // si viene el portada

                const portada = imgs.portada;

                // mover la portada a carpeta
                if (!fs.existsSync(rutaNegocio)) {
                    fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err) throw err;
                        portada.mv(`${rutaNegocio}/portada.png`, (err: any) => {
                            if (err) throw err;
                            resolve(`${rutaNegocio}/portada.png`);
                        });
                    });
                } else {
                    portada.mv(`${rutaNegocio}/portada.png`, (err: any) => {
                        if (err) throw err;
                        resolve(`${rutaNegocio}/portada.png`);
                    });
                }
            }
        });

        // video
        const promesaVideo = new Promise((resolve, reject) => {

            if (!imgs?.video) { // si no viene un logo
                // mover el video default
                if (!fs.existsSync(rutaNegocio)) { // si no existe la ruta
                    fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err) throw err;
                        fs.copyFileSync(`${pathVideo}`, `${rutaNegocio}/video.mp4`);
                        resolve(`${rutaNegocio}/video.mp4`);
                    });
                } else { // si ya existe
                    fs.copyFileSync(`${pathVideo}`, `${rutaNegocio}/video.mp4`);
                    resolve(`${rutaNegocio}/video.mp4`);
                }
            } else { // si viene el video

                const video = imgs.video;
                const ext = video.mimetype;
                // mover el video a carpeta
                if (!fs.existsSync(rutaNegocio)) {
                    fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                        if (err) throw err;
                        video.mv(`${rutaNegocio}/video.${ext}`, (err: any) => {
                            if (err) throw err;
                            resolve(`${rutaNegocio}/video.mp4`);
                        });
                    });
                } else {
                    video.mv(`${rutaNegocio}/video.${ext}`, (err: any) => {
                        if (err) throw err;
                        resolve(`${rutaNegocio}/video.mp4`);
                    });
                }
            }
        });

        // docs
        const promesaDocs = new Promise((resolve, reject) => {
            const docs = imgs.docs;
            const name: string = docs.name;
            const partes = name.split('.');
            const ext = partes[partes.length - 1];
            // mover el docs a carpeta
            if (!fs.existsSync(rutaNegocio)) {
                fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                    if (err) throw err;
                    docs.mv(`${rutaNegocio}/docs.${ext}`, (err: any) => {
                        if (err) throw err;
                        resolve(`${rutaNegocio}/docs.${ext}`)
                    });
                });
            } else {
                docs.mv(`${rutaNegocio}/docs.${ext}`, (err: any) => {
                    if (err) throw err;
                    resolve(`${rutaNegocio}/docs.${ext}`);
                });
            }
        });

        // // img
        const promesaImgs = new Promise(async (resolve, reject) => {
            const arrayImg: any[] = [];
            const arrayResolve: any[] = [];
            arrayImg.push(imgs.img);

            // cuando no viene imagen
            if (!imgs.img) {
                for (let i = 0; i < 3; i++) {
                    // mover el logo default
                    if (!fs.existsSync(rutaNegocio)) { // si no existe la ruta
                        fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                            if (err) reject(err);
                            fs.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${i}.png`);
                            arrayResolve.push(`${rutaNegocio}/img${i}.png`);
                            resolve(arrayResolve)
                        });
                    } else { // si ya existe
                        fs.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${i}.png`);
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
                        if (!fs.existsSync(rutaNegocio)) {
                            fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                                if (err) reject(err);
                                fs.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${i}.png`);
                                arrayResolve.push(`${rutaNegocio}/img${i}.png`);
                                resolve(arrayResolve);
                            });
                        } else {
                            fs.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${i}.png`);
                            arrayResolve.push(`${rutaNegocio}/img${i}.png`);
                            resolve(arrayResolve);
                        }
                    }

                    // subir las img
                    if (!fs.existsSync(rutaNegocio)) {
                        fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                            if (err) reject(err);
                            imgs.img.mv(`${rutaNegocio}/img2.png`, (err: any) => {
                                if (err) reject(err);
                                arrayResolve.push(`${rutaNegocio}/img2.png`);
                                resolve(arrayResolve);
                            });
                        });
                    } else {
                        imgs.img.mv(`${rutaNegocio}/img2.png`, (err: any) => {
                            if (err) reject(err);
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
                            if (!fs.existsSync(rutaNegocio)) { // si no existe la ruta
                                fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                                    if (err) reject(err);
                                    fs.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${j}.png`);
                                    arrayResolve.push(`${rutaNegocio}/img${j}.png`);
                                    resolve(arrayResolve);
                                });
                            } else { // si ya existe
                                fs.copyFileSync(`${pathLogoPortada}`, `${rutaNegocio}/img${j}.png`);
                                arrayResolve.push(`${rutaNegocio}/img${j}.png`);
                                resolve(arrayResolve);
                            }
                        } else if(imgs.img[j] !== undefined) {
                            // subir las img
                            if (!fs.existsSync(rutaNegocio)) {
                                fs.mkdir(rutaNegocio, { recursive: true }, (err) => {
                                    if (err) reject(err);
                                    imgs.img[j].mv(`${rutaNegocio}/img${j}.png`, (err: any) => {
                                        if (err) reject(err);
                                    });
                                    arrayResolve.push(`${rutaNegocio}/img${j}.png`);
                                    resolve(arrayResolve);
                                });
                            } else {
                                imgs.img[j].mv(`${rutaNegocio}/img${j}.png`, (err: any) => {
                                    if (err) reject(err);
                                });
                                arrayResolve.push(`${rutaNegocio}/img${j}.png`);
                                resolve(arrayResolve);
                            }
                        }
                    } 
                }

            }

        }); 

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
