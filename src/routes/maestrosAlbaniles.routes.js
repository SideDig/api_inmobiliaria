import { Router } from "express";
import { obtenermaestrosAlbaniles, obtenermaestroAlbanil, insertarmaestrosAlbaniles, eliminarmaestroAlbanil } from "../controllers/maestrosAlbanilesController.js";

const router = Router();

router.get('/albaniles', obtenermaestrosAlbaniles)
router.get('/albaniles/:id', obtenermaestroAlbanil)
router.post('/albaniles', insertarmaestrosAlbaniles)
router.delete('/albaniles/:id', eliminarmaestroAlbanil);

export default router;