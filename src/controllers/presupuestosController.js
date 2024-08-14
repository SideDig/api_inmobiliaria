import { conexion } from "../db.js";
import sendBudgetEmail from '../controllers/correosController.js';

export const crearPresupuesto = async (req, res) => {
  const connection = await conexion.getConnection();
  try {
    const { cliente_id, propiedad_id, agente_id, total, fecha_creacion, items, builders } = req.body;

    // Validar que items sea un arreglo
    if (!Array.isArray(items)) {
      throw new Error('El campo "items" debe ser un arreglo.');
    }

    await connection.beginTransaction();

    // 1. Crear el presupuesto en la base de datos
    const [result] = await connection.query(
      'INSERT INTO presupuestos (cliente_id, propiedad_id, agente_id, total, fecha_creacion) VALUES (?, ?, ?, ?, ?)',
      [cliente_id, propiedad_id, agente_id, total, fecha_creacion]
    );

    if (!result.insertId) {
      throw new Error('Error al crear el presupuesto en la base de datos.');
    }

    const presupuestoId = result.insertId;

    // 2. Guardar cada detalle del presupuesto y recopilar la información para el correo
    let itemsDetails = '';
    for (const item of items) {
      const builderId = builders[item.id];
      if (builderId) {
        const [maestro] = await connection.query(
          'SELECT id, costo_estimado, tiempo_estimado FROM trabajos_maestros_albaniles WHERE maestro_albanil_id = ? AND item_personalizable_id = ?',
          [builderId, item.id]
        );

        if (maestro.length > 0) {
          await connection.query(
            'INSERT INTO detalles_presupuesto (presupuesto_id, trabajo_maestro_albanil_id, costo_estimado, tiempo_estimado) VALUES (?, ?, ?, ?)',
            [presupuestoId, maestro[0].id, maestro[0].costo_estimado, maestro[0].tiempo_estimado]
          );

          // Obtener el nombre del maestro de la tabla `maestros_albaniles`
          const [maestroInfo] = await connection.query(
            'SELECT nombre FROM maestros_albaniles WHERE id = ?',
            [builderId]
          );

          const maestroNombre = maestroInfo[0]?.nombre || 'N/A';

          // Añadir detalles del ítem y el maestro al cuerpo del correo
          itemsDetails += `
            <div>
              <p><strong>Ítem:</strong> ${item.nombre}</p>
              <p><strong>Maestro Albañil:</strong> ${maestroNombre}</p>
              <p><strong>Costo Estimado:</strong> $${maestro[0].costo_estimado}</p>
              <p><strong>Tiempo Estimado:</strong> ${maestro[0].tiempo_estimado} días</p>
            </div>
            <hr>
          `;
        } else {
          console.warn(`No se encontró un maestro para item ${item.id} con builder ${builderId}`);
        }
      } else {
        console.warn(`No se encontró un builderId para el item ${item.id}`);
      }
    }

    // 3. Registrar el envío del correo en la base de datos
    await connection.query(
      'INSERT INTO correos_enviados (cliente_id, presupuesto_id, fecha_envio) VALUES (?, ?, NOW())',
      [cliente_id, presupuestoId]
    );

    // 4. Confirmar la transacción
    await connection.commit();

    // 5. Responder con el ID del presupuesto creado
    res.status(201).json({ id: presupuestoId });

  } catch (error) {
    console.error('Error al crear el presupuesto:', error);
    await connection.rollback();
    res.status(500).json({ error: 'Error al crear el presupuesto' });
  } finally {
    connection.release();
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

    // Recopilar los detalles de los ítems y maestros albañiles
    const [detalles] = await conexion.query(
      `SELECT ip.nombre AS item_nombre, ma.nombre AS maestro_nombre, tp.costo_estimado, tp.tiempo_estimado 
      FROM detalles_presupuesto dp 
      JOIN trabajos_maestros_albaniles tp ON dp.trabajo_maestro_albanil_id = tp.id 
      JOIN items_personalizables ip ON tp.item_personalizable_id = ip.id 
      JOIN maestros_albaniles ma ON tp.maestro_albanil_id = ma.id 
      WHERE dp.presupuesto_id = ?`,
      [presupuesto_id]
    );

    let itemsDetails = '';
    detalles.forEach(detalle => {
      const costoEstimado = parseFloat(detalle.costo_estimado) || 0;
      itemsDetails += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${detalle.item_nombre}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${detalle.maestro_nombre}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">$${costoEstimado.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${detalle.tiempo_estimado} días</td>
        </tr>
      `;
    });

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
          <h3 style="color: #001061;">Detalles de Ítems y Maestros Albañiles</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7;">Ítem</th>
                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7;">Maestro Albañil</th>
                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7;">Costo Estimado</th>
                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7;">Tiempo Estimado</th>
              </tr>
            </thead>
            <tbody>
              ${itemsDetails}
            </tbody>
          </table>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #001061;">Total del Presupuesto</h3>
          <p style="font-size: 20px; color: #555;"><strong>$${presupuesto[0].total.toLocaleString()}</strong></p>
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

export const obtenerPresupuestosUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const [presupuestos] = await conexion.query(
      'SELECT * FROM presupuestos WHERE cliente_id = ? ORDER BY fecha_creacion DESC',
      [usuario_id]
    );

    if (presupuestos.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(presupuestos);
  } catch (error) {
    console.error('Error al obtener los presupuestos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los presupuestos del usuario.' });
  }
};