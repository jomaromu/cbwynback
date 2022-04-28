"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// instanciar el router
const routerPrincipal = (0, express_1.Router)();
// ruta principal
routerPrincipal.get('/', (req, resp) => {
    return resp.json({
        ok: true,
        mensaje: 'Ruta principal bien'
    });
});
exports.default = routerPrincipal;
