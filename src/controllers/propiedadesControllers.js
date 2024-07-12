import { conexion } from "../db.js";

export const obtenerPropiedades = async (req, res) => {
  try {
    const [rows] = await conexion.query(`
        SELECT 
            p.*, 
            u.id AS agente_id, 
            u.nombre AS agente_nombre, 
            u.email AS agente_email, 
            u.telefono AS agente_telefono,
            u.total_ventas AS agente_total_ventas,
            (SELECT COUNT(*) FROM propiedades WHERE agente_id = u.id) AS agente_num_propiedades
        FROM 
            propiedades p
        JOIN 
            usuarios u 
        ON 
            p.agente_id = u.id
        WHERE 
            u.rol = 'agente';
      `);

    const propiedades = rows.map(
      ({
        agente_id,
        agente_nombre,
        agente_email,
        agente_telefono,
        agente_total_ventas,
        agente_num_propiedades,
        ...propiedad
      }) => ({
        ...propiedad,
        agente: {
          id: agente_id,
          nombre: agente_nombre,
          email: agente_email,
          telefono: agente_telefono,
          total_ventas: agente_total_ventas,
          num_propiedades: agente_num_propiedades,
        },
      })
    );

    res.json(propiedades);
  } catch (error) {
    console.error(error);
    res.status(500).send("No aparecen las propiedades");
  }
};

export const obtenerPropiedad = async (req, res) => {
  try {
    const [rows] = await conexion.query(
      `
        SELECT 
          p.*, 
          a.id AS agente_id, 
          a.nombre AS agente_nombre, 
          a.email AS agente_email, 
          a.telefono AS agente_telefono,
          a.total_ventas AS agente_total_ventas,
          (SELECT COUNT(*) FROM propiedades WHERE agente_id = a.id) AS agente_num_propiedades
        FROM 
          propiedades p
        JOIN 
          agentes a 
        ON 
          p.agente_id = a.id
        WHERE
        p.id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).send("Propiedad no encontrada");
    }

    const propiedad = rows.map(
      ({
        agente_id,
        agente_nombre,
        agente_email,
        agente_telefono,
        agente_total_ventas,
        agente_num_propiedades,
        ...propiedad
      }) => ({
        ...propiedad,
        agente: {
          id: agente_id,
          nombre: agente_nombre,
          email: agente_email,
          telefono: agente_telefono,
          total_ventas: agente_total_ventas,
          num_propiedades: agente_num_propiedades,
        },
      })
    );
    res.json(propiedad);
  } catch (error) {
    console.error(error);
    res.status(500).send("No aparecen la propiedad");
  }
};

export const insertarPropiedad = async (req, res) => {
  try {
    const [rows] = await conexion.query(
      "INSERT INTO `propiedades` SET ?",
      req.body
    );
    res.send({
      id: rows.insertId,
      ...req.body,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al insertar la propiedad", error });
  }
};

export const eliminarPropiedad = async (req, res) => {
  try {
    const [eliminar] = await conexion.query(
      "DELETE FROM `propiedades` WHERE id = ?",
      [req.params.id]
    );
    if (eliminar.affectedRows <= 0)
      return res.status(404).json({
        message: "No se encontro la propiedad",
      });
    res.send("Propiedad eliminada");
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudo eliminar el cliente");
  }
};
