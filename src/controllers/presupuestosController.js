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

    const [presupuesto] = await conexion.query(
      'SELECT * FROM presupuestos WHERE id = ?',
      [presupuesto_id]
    );

    if (presupuesto.length === 0) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }

    const [propiedad] = await conexion.query(
      'SELECT nombre_propiedad, direccion, descripcion, precio, habitaciones, baños, tamaño_terreno FROM propiedades WHERE id = ?',
      [presupuesto[0].propiedad_id]
    );

    if (propiedad.length === 0) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    const [cliente] = await conexion.query('SELECT email FROM usuarios WHERE id = ?', [cliente_id]);
    
    if (cliente.length === 0 || !cliente[0].email) {
      throw new Error('No se encontró el correo del cliente.');
    }

    const userEmail = cliente[0].email;

    
    const fechaCreacion = new Date(presupuesto[0].fecha_creacion);
    const fechaFormateada = `${fechaCreacion.toLocaleDateString()} ${fechaCreacion.toLocaleTimeString()}`;

    const budgetDetails = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #001061;">Detalles del Presupuesto</h2>
      <p style="font-size: 15px; color: #777;">Aquí están los detalles de tu presupuesto para la propiedad seleccionada.</p>
    </div>
    <div style="background-color: #f7f7f7; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
      <h2 style="color: #001061;">Propiedad: ${propiedad[0].nombre_propiedad}</h2>
      <p style="margin: 5px 0;"><strong>Dirección:</strong> ${propiedad[0].direccion}</p>
      <p style="margin: 5px 0;"><strong>Descripción:</strong> ${propiedad[0].descripcion}</p>
      <p style="margin: 5px 0;"><strong>Precio:</strong> $${propiedad[0].precio.toLocaleString()}</p>
      <p style="margin: 5px 0;"><strong>Habitaciones:</strong> ${propiedad[0].habitaciones}</p>
      <p style="margin: 5px 0;"><strong>Baños:</strong> ${propiedad[0].baños}</p>
      <p style="margin: 5px 0;"><strong>Tamaño del Terreno:</strong> ${propiedad[0].tamaño_terreno} m²</p>
    </div>
    <div style="background-color: #f1f1f1; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
      <h3 style="color: #001061;">Total del Presupuesto</h3>
      <p style="font-size: 20px; color: #555;"><strong>$${presupuesto[0].total.toLocaleString()}</strong></p>
    </div>
    <div style="background-color: #eaeaea; padding: 15px; border-radius: 10px;">
      <p style="margin: 5px 0;"><strong>Fecha de Creación:</strong> ${fechaFormateada}</p>
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.tu-sitio-web.com" style="text-decoration: none; color: #fff; background-color: #001061; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Ver Más Detalles</a>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
      <p>&copy; 2024 Tu Empresa. Todos los derechos reservados.</p>
      <p>Este es un correo electrónico generado automáticamente, por favor no responda.</p>
    </div>
  </div>
`;


    // Enviar el correo
    await sendBudgetEmail(userEmail, budgetDetails);

    res.status(200).json({ message: 'Correo enviado exitosamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo.' });
  }
};
