import { Router } from "express";
import { crearPresupuesto, crearDetallePresupuesto } from '../controllers/presupuestosController.js';

const router = Router();

router.post('/presupuestos', crearPresupuesto);
router.post('/detalles_presupuesto', crearDetallePresupuesto);

export default router;