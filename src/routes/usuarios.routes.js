import { Router } from 'express';
import { obtenerUsuarios, obtenerUsuario, insertarUsuario, eliminarUsuario } from "../controllers/usuariosController.js";

const router = Router();

router.get('/usuarios', obtenerUsuarios);
router.get('/usuarios/:id', obtenerUsuario);
router.post('/usuarios', insertarUsuario);
router.delete('/usuarios/:id', eliminarUsuario);

export default router;
