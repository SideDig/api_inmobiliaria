import { Router } from 'express';
import { 
    insertarImg, getImagenesByPropiedad, getImagenById, deleteImagen } from '../controllers/imgPropiedadesController.js';

const router = Router();

router.post('/imagenes', insertarImg);
router.get('/propiedades/:propiedadId/imagenes', getImagenesByPropiedad);
router.get('/imagenes/:id', getImagenById);
router.delete('/imagenes/:id', deleteImagen);

export default router;
