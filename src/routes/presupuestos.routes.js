import { Router } from 'express';
import { crearPresupuesto, crearDetallePresupuesto, enviarCorreoPresupuesto } from '../controllers/presupuestosController.js';

const router = Router();

router.post('/presupuestos', crearPresupuesto);
router.post('/detalles_presupuesto', crearDetallePresupuesto);
router.post('/correos/enviar', enviarCorreoPresupuesto); // Nueva ruta para enviar el correo

export default router;
