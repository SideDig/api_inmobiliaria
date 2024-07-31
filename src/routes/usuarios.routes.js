import { Router } from 'express';
import { obtenerUsuarios, obtenerUsuario, insertarUsuario, eliminarUsuario, completarDatosPersonales, completarPreferenciasUsuario, obtenerPropiedadesPorUbicacion  } from "../controllers/usuariosController.js";
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = Router();

router.get('/usuarios', obtenerUsuarios);
router.get('/usuarios/:id', obtenerUsuario);
router.post('/usuarios', insertarUsuario);
router.delete('/usuarios/:id', eliminarUsuario);
router.post('/usuarios/completarDatosPersonales', verifyToken, completarDatosPersonales);
router.post('/usuarios/completarPreferenciasUsuario', verifyToken, completarPreferenciasUsuario);
router.get('/propiedades/ubicacion', obtenerPropiedadesPorUbicacion);

export default router;
