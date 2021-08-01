import { Socket } from 'socket.io';
import socketIO from 'socket.io';

// emitir ids
export const emitGetIds = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('emitGetIds', () => {
        io.to(cliente.id).emit('usuarios-conectados', cliente.id);
    });
}