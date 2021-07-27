import { FileArray } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';

export default class UsuarioClass {

    constructor() { }

    // metodos de la clase
    public transformaImgs(imgs: FileArray | undefined | any, idUusuario: String): any {


        const miliseconds = new Date().getMilliseconds();

        const pathAvatar = path.resolve(__dirname, '../assets/avatar.png');
        const rutaUsuario = path.resolve(__dirname, `../uploads/${idUusuario}/perfil`);
        // const rutanegocioCorta = `${idUusuario}-${miliseconds}`;
        // const rutaArchivosUsuario = path.resolve(__dirname, `../uploads/${idUusuario}/usuario`);

        // avatar
        const promesaArchivosUsuario = new Promise((resolve, reject) => {
            if (!imgs?.avatar) { // si no viene un avatar
                // mover el logo default
                if (!fs.existsSync(rutaUsuario)) { // si no existe la ruta
                    fs.mkdir(`${rutaUsuario}`, { recursive: true }, (err) => {
                        // console.log('no existe - no viene');
                        if (err) throw err;
                        fs.copyFileSync(`${pathAvatar}`, `${rutaUsuario}/avatar-${miliseconds}.png`);
                        resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                    });
                } else { // si ya existe
                    // console.log('existe - no viene');

                    // verificar que esté vacío
                    fs.readdir(rutaUsuario, (err, file) => {
                        if (file.length === 0) {
                            fs.copyFileSync(`${pathAvatar}`, `${rutaUsuario}/avatar-${miliseconds}.png`);
                            resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                        } else {
                            rimraf(`${rutaUsuario}/*`, (err) => {
                                if (err) {
                                    reject('No se pudo borrar el avatar default');
                                } else {
                                    // actualizar el avatar default
                                    fs.copyFileSync(`${pathAvatar}`, `${rutaUsuario}/avatar-${miliseconds}.png`);
                                    resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                                }
                            });

                        }
                    });
                }
            } else { // si viene el avatar

                const avatar = imgs.avatar;

                // mover el avatar a carpeta
                if (!fs.existsSync(rutaUsuario)) {
                    // console.log('no existe - viene');
                    fs.mkdir(rutaUsuario, { recursive: true }, (err) => {
                        if (err) throw err;
                        avatar.mv(`${rutaUsuario}/avatar-${miliseconds}.png`, (err: any) => {
                            if (err) throw err;
                            resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                        });
                    });
                } else {
                    // console.log('existe - viene');

                    // verificar que esté vacío
                    fs.readdir(rutaUsuario, (err, file) => {

                        if (file.length === 0) {
                            avatar.mv(`${rutaUsuario}/avatar-${miliseconds}.png`, (err: any) => {
                                if (err) throw err;
                                resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                            });
                        } else {
                            rimraf(`${rutaUsuario}/*`, (err) => {
                                if (err) {
                                    reject('No se pudo borrar el avatar default');
                                } else {
                                    avatar.mv(`${rutaUsuario}/avatar-${miliseconds}.png`, (err: any) => {
                                        if (err) throw err;
                                        resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });



        return Promise.all([promesaArchivosUsuario])
            .then((data) => {
                const objUsuario = {
                    data,
                    // rutaArchivosUsuario,
                    rutaUsuario,
                    // rutanegocioCorta
                };
                return objUsuario;
            }).catch((err) => {
                return err;
            });
    } // fin de transformaImgs
}
