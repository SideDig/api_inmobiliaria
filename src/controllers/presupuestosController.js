import { conexion } from '../db.js';

export const crearPresupuesto = async (req, res) => {
  try {
    const { cliente_id, propiedad_id, agente_id, total, fecha_creacion } = req.body;

    const [result] = await conexion.query(
      'INSERT INTO presupuestos (cliente_id, propiedad_id, agente_id, total, fecha_creacion) VALUES (?, ?, ?, ?, ?)',
      [cliente_id, propiedad_id, agente_id, total, fecha_creacion]
    );

    res.status(201).json({ id: result.insertId });
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

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear el detalle del presupuesto:', error);
    res.status(500).json({ error: 'Error al crear el detalle del presupuesto' });
  }
};
