import { Router } from "express";
import { obtenerItems, obtenerItem, insertarItem, eliminaritem } from "../controllers/itemsPersonalizablesController.js";

const router = Router();

router.get('/items',obtenerItems)
router.get('/items/:id',obtenerItem)
router.post('/items',insertarItem)
router.delete('/items/:id', eliminaritem)

export default router;