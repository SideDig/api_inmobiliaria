import { Router } from 'express';
import { crearPresupuesto, crearDetallePresupuesto, enviarCorreoPresupuesto, obtenerPresupuestosUsuario  } from '../controllers/presupuestosController.js';

const router = Router();

router.post('/presupuestos', crearPresupuesto);
router.post('/detalles_presupuesto', crearDetallePresupuesto);
router.post('/correos/enviar', enviarCorreoPresupuesto); 
router.get('/presupuestos/usuario/:usuario_id', obtenerPresupuestosUsuario);

export default router;
