import { conexion } from "../db.js";
import sendBudgetEmail from '../controllers/correosController.js';

export const crearPresupuesto = async (req, res) => {
  try {
    const { cliente_id, propiedad_id, agente_id, total, fecha_creacion } = req.body;

    // 1. Crear el presupuesto en la base de datos
    const [result] = await conexion.query(
      'INSERT INTO presupuestos (cliente_id, propiedad_id, agente_id, total, fecha_creacion) VALUES (?, ?, ?, ?, ?)',
      [cliente_id, propiedad_id, agente_id, total, fecha_creacion]
    );

    if (!result.insertId) {
      throw new Error('Error al crear el presupuesto en la base de datos.');
    }

    const presupuestoId = result.insertId;

    // 2. Obtener el correo del cliente
    const [cliente] = await conexion.query('SELECT email FROM usuarios WHERE id = ?', [cliente_id]);
    
    if (cliente.length === 0 || !cliente[0].email) {
      throw new Error('No se encontró el correo del cliente.');
    }

    const userEmail = cliente[0].email;

    // 3. Construir los detalles del presupuesto para el correo
    const budgetDetails = `Propiedad: ${propiedad_id}\nTotal: $${total}\nFecha: ${fecha_creacion}`;

    // 4. Enviar el correo al cliente
    await sendBudgetEmail(userEmail, budgetDetails);

    // 5. Registrar el envío del correo en la base de datos
    await conexion.query(
      'INSERT INTO correos_enviados (cliente_id, presupuesto_id, fecha_envio) VALUES (?, ?, NOW())',
      [cliente_id, presupuestoId]
    );

    // 6. Responder con el ID del presupuesto creado
    res.status(201).json({ id: presupuestoId });
  } catch (error) {
    console.error('Error al crear el presupuesto:', error);
    res.status(500).json({ error: 'Error al crear el presupuesto' });
  }
};

export const crearDetallePresupuesto = async (req, res) => {
  try {
    const { presupuesto_id, trabajo_maestro_albanil_id, costo_estimado, tiempo_estimado } = req.body;

    const [result] = await conexion.query(
      'INSERT INTO detalles_presupuesto (presupuesto_id, trabajo_maestro_albanil_id, costo_estimado, tiempo_estimado) VALUES (?, ?, ?, ?)',
      [presupuesto_id, trabajo_maestro_albanil_id, costo_estimado, tiempo_estimado]
    );

    if (!result.insertId) {
      throw new Error('Error al crear el detalle del presupuesto en la base de datos.');
    }

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear el detalle del presupuesto:', error);
    res.status(500).json({ error: 'Error al crear el detalle del presupuesto' });
  }
};

export const enviarCorreoPresupuesto = async (req, res) => {
  try {
    const { presupuesto_id, cliente_id } = req.body;

    // Obtener el presupuesto
    const [presupuesto] = await conexion.query(
      'SELECT * FROM presupuestos WHERE id = ?',
      [presupuesto_id]
    );

    if (presupuesto.length === 0) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }

    // Obtener el correo del cliente
    const [cliente] = await conexion.query('SELECT email FROM usuarios WHERE id = ?', [cliente_id]);
    
    if (cliente.length === 0 || !cliente[0].email) {
      throw new Error('No se encontró el correo del cliente.');
    }

    const userEmail = cliente[0].email;

    // Construir los detalles del presupuesto para el correo
    const budgetDetails = `Propiedad: ${presupuesto[0].propiedad_id}\nTotal: $${presupuesto[0].total}\nFecha: ${presupuesto[0].fecha_creacion}`;

    // Enviar el correo
    await sendBudgetEmail(userEmail, budgetDetails);

    res.status(200).json({ message: 'Correo enviado exitosamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo.' });
  }
};
