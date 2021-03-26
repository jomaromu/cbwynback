import { Router, Request, Response } from 'express';

// instanciar el router
const routerPrincipal = Router();

// ruta principal
routerPrincipal.get('/', (req: Request, resp: Response) => {
    
    return resp.json({
        ok: true,
        mensaje: 'Ruta principal bien'
    });
});

export default routerPrincipal;