import { Router } from "express";
import { obtenerItems, obtenerItem, insertarItem, eliminarItem, obtenerCategoriasConItems } from "../controllers/itemsPersonalizablesController.js";

const router = Router();

router.get('/items', obtenerItems);
router.get('/items/:id', obtenerItem);
router.post('/items', insertarItem);
router.delete('/items/:id', eliminarItem);
router.get('/item/categories', obtenerCategoriasConItems); // Asegúrate de que esta ruta esté correcta

export default router;
