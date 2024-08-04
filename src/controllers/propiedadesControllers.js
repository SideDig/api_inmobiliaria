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
    const propiedadId = req.params.id;
    console.log('Request to obtenerPropiedad with id:', propiedadId);

    const [rows] = await conexion.query(
      `
        SELECT 
          p.*, 
          u.id AS agente_id, 
          u.nombre AS agente_nombre, 
          u.email AS agente_email, 
          u.telefono AS agente_telefono,
          u.total_ventas AS agente_total_ventas,
          u.num_propiedades AS agente_num_propiedades
        FROM 
          propiedades p
        JOIN 
          usuarios u 
        ON 
          p.agente_id = u.id
        WHERE
          p.id = ?
        AND
          u.rol = 'agente'
      `,
      [propiedadId]
    );

    if (rows.length === 0) {
      console.log('Propiedad no encontrada'); 
      return res.status(404).send("Propiedad no encontrada");
    }

    const propiedad = rows.map(row => ({
      ...row,
      agente: {
        id: row.agente_id,
        nombre: row.agente_nombre,
        email: row.agente_email,
        telefono: row.agente_telefono,
        total_ventas: row.agente_total_ventas,
        num_propiedades: row.agente_num_propiedades,
      },
    }))[0];

    res.json(propiedad);
  } catch (error) {
    console.error('Error en obtenerPropiedad:', error); 
    res.status(500).send("Error al obtener la propiedad");
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
