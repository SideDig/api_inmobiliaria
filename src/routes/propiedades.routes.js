import { Router } from "express";
import { obtenerPropiedad, obtenerPropiedades, eliminarPropiedad, insertarPropiedad, obtenerPropiedadesPorAgente  } from "../controllers/propiedadesControllers.js";

const router = Router();

router.get('/propiedades', obtenerPropiedades);
router.get('/propiedades/:id', obtenerPropiedad);
router.delete('/propiedades/:id', eliminarPropiedad);
router.post('/propiedades', insertarPropiedad);
router.get('/propiedades/agente/:id', obtenerPropiedadesPorAgente);

export default router;