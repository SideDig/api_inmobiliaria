import { Router } from 'express';
import { obtenerUsuarios, obtenerUsuario, insertarUsuario, eliminarUsuario, completarDatosPersonales } from "../controllers/usuariosController.js";
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = Router();

router.get('/usuarios', obtenerUsuarios);
router.get('/usuarios/:id', obtenerUsuario);
router.post('/usuarios', insertarUsuario);
router.delete('/usuarios/:id', eliminarUsuario);
router.post('/usuarios/completarDatosPersonales', verifyToken, completarDatosPersonales);

export default router;
