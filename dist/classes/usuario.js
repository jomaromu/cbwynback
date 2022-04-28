"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const rimraf_1 = __importDefault(require("rimraf"));
class UsuarioClass {
    constructor() { }
    // metodos de la clase
    transformaImgs(imgs, idUusuario) {
        const miliseconds = new Date().getMilliseconds();
        const pathAvatar = path_1.default.resolve(__dirname, '../assets/avatar.png');
        const rutaUsuario = path_1.default.resolve(__dirname, `../uploads/${idUusuario}/perfil`);
        // const rutanegocioCorta = `${idUusuario}-${miliseconds}`;
        // const rutaArchivosUsuario = path.resolve(__dirname, `../uploads/${idUusuario}/usuario`);
        // avatar
        const promesaArchivosUsuario = new Promise((resolve, reject) => {
            if (!(imgs === null || imgs === void 0 ? void 0 : imgs.avatar)) { // si no viene un avatar
                // mover el logo default
                if (!fs_1.default.existsSync(rutaUsuario)) { // si no existe la ruta
                    fs_1.default.mkdir(`${rutaUsuario}`, { recursive: true }, (err) => {
                        // console.log('no existe - no viene');
                        if (err)
                            throw err;
                        fs_1.default.copyFileSync(`${pathAvatar}`, `${rutaUsuario}/avatar-${miliseconds}.png`);
                        resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                    });
                }
                else { // si ya existe
                    // console.log('existe - no viene');
                    // verificar que esté vacío
                    fs_1.default.readdir(rutaUsuario, (err, file) => {
                        if (file.length === 0) {
                            fs_1.default.copyFileSync(`${pathAvatar}`, `${rutaUsuario}/avatar-${miliseconds}.png`);
                            resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                        }
                        else {
                            (0, rimraf_1.default)(`${rutaUsuario}/*`, (err) => {
                                if (err) {
                                    reject('No se pudo borrar el avatar default');
                                }
                                else {
                                    // actualizar el avatar default
                                    fs_1.default.copyFileSync(`${pathAvatar}`, `${rutaUsuario}/avatar-${miliseconds}.png`);
                                    resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                                }
                            });
                        }
                    });
                }
            }
            else { // si viene el avatar
                const avatar = imgs.avatar;
                // mover el avatar a carpeta
                if (!fs_1.default.existsSync(rutaUsuario)) {
                    // console.log('no existe - viene');
                    fs_1.default.mkdir(rutaUsuario, { recursive: true }, (err) => {
                        if (err)
                            throw err;
                        avatar.mv(`${rutaUsuario}/avatar-${miliseconds}.png`, (err) => {
                            if (err)
                                throw err;
                            resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                        });
                    });
                }
                else {
                    // console.log('existe - viene');
                    // verificar que esté vacío
                    fs_1.default.readdir(rutaUsuario, (err, file) => {
                        if (file.length === 0) {
                            avatar.mv(`${rutaUsuario}/avatar-${miliseconds}.png`, (err) => {
                                if (err)
                                    throw err;
                                resolve(`${rutaUsuario}/avatar-${miliseconds}.png`);
                            });
                        }
                        else {
                            (0, rimraf_1.default)(`${rutaUsuario}/*`, (err) => {
                                if (err) {
                                    reject('No se pudo borrar el avatar default');
                                }
                                else {
                                    avatar.mv(`${rutaUsuario}/avatar-${miliseconds}.png`, (err) => {
                                        if (err)
                                            throw err;
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
exports.default = UsuarioClass;
