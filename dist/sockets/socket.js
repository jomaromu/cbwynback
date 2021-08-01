"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitGetIds = void 0;
// emitir ids
exports.emitGetIds = (cliente, io) => {
    cliente.on('emitGetIds', () => {
        io.to(cliente.id).emit('usuarios-conectados', cliente.id);
    });
};
