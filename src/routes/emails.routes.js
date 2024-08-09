import express from 'express';
import sendBudgetEmail from '../controllers/correosController.js'; // Importa la función correcta

const router = express.Router();

router.post('/saveBudget', sendBudgetEmail); // Usa la función importada correctamente

export default router; // Usa export default para mantener la consistencia con import
