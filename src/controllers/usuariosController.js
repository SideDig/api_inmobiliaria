import { conexion } from "../db.js";

export const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await conexion.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("No aparecieron los clientes");
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const [rows] = await conexion.query("SELECT * FROM usuarios WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("No aparecio el cliente");
  }
};

export const insertarUsuario = async (req, res) => {
  try {
    const [rows] = await conexion.query(
      "INSERT INTO `clientes` SET ?",
      req.body
    );
    res.send({
      id: rows.insertId,
      ...req.body,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al insertar cliente", error });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const [eliminar] = await conexion.query(
      "DELETE FROM clientes WHERE id = ?",
      [req.params.id]
    );
    if (eliminar.affectedRows <= 0)
      return res.status(404).json({
        menssage: "No se encontro el cliente",
      });
    res.send("Cliente eliminado");
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudo eliminar el cliente");
  }
};

export const completarDatosPersonales = async (req, res) => {
  const { nombre_completo, telefono, curp, estado, ciudad, direccion } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Usuario no autenticado." });
  }

  const { id } = req.user;

  try {
    const query = `
      UPDATE usuarios
      SET nombre_completo = ?, telefono = ?, curp = ?,
          estado = ?, ciudad = ?, direccion = ?
      WHERE id = ?
    `;
    await conexion.execute(query, [
      nombre_completo,
      telefono,
      curp,
      estado,
      ciudad,
      direccion,
      id,
    ]);

    res.json({ message: "Datos adicionales actualizados correctamente" });
  } catch (error) {
    console.error("Error al completar datos adicionales:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al completar los datos adicionales" });
  }
};

export const completarPreferenciasUsuario = async (req, res) => {
  const { ubicacion_casa, num_recamaras, precio_desde, precio_hasta} = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Usuario no autenticado." });
  }

  const { id } = req.user;

  try {
    const query = `
      UPDATE usuarios
      SET ubicacion_casa = ?, num_recamaras = ?, precio_desde = ?,
          precio_hasta = ?
      WHERE id = ?
    `;
    await conexion.execute(query, [
      ubicacion_casa,
      num_recamaras,
      precio_desde,
      precio_hasta,
      id,
    ]);

    res.json({ message: "Preferencias actualizadas correctamente" });
  } catch (error) {
    console.error("Error al completar datos adicionales:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al completar los datos adicionales" });
  }
};


export const obtenerPropiedadesPorUbicacion = async (req, res) => {
  const { ubicacion, precioDesde, precioHasta, numRecamaras } = req.query;
  console.log('Request received for obtenerPropiedadesPorUbicacion with ubicacion:', ubicacion, 'precioDesde:', precioDesde, 'precioHasta:', precioHasta, 'numRecamaras:', numRecamaras);

  try {
    let query = "SELECT * FROM propiedades WHERE 1=1";
    let queryParams = [];

    if (ubicacion) {
      query += " AND ubicacion = ?";
      queryParams.push(ubicacion);
    }

    if (precioDesde) {
      query += " AND precio >= ?";
      queryParams.push(precioDesde);
    }

    if (precioHasta) {
      query += " AND precio <= ?";
      queryParams.push(precioHasta);
    }

    if (numRecamaras) {
      query += " AND habitaciones = ?";
      queryParams.push(numRecamaras);
    }

    const [rows] = await conexion.query(query, queryParams);
    console.log('Database response:', rows);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener propiedades por ubicación:", error);
    res.status(500).send("No se pudieron obtener las propiedades");
  }
};






