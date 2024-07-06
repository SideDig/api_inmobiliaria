import { Router } from "express";
import { obtenerPropiedad, obtenerPropiedades, eliminarPropiedad, insertarPropiedad } from "../controllers/propiedadesControllers.js";

const router = Router();

router.get('/propiedades', obtenerPropiedades);
router.get('/propiedades/:id', obtenerPropiedad);
router.delete('/propiedades/:id', eliminarPropiedad);
router.post('/propiedades', insertarPropiedad);

export default router;