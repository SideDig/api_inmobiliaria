import { conexion } from "../db.js";

export const obtenermaestrosAlbaniles = async (req, res) => {
  try {
    const [rows] = await conexion.query("SELECT * FROM maestros_albaniles");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("No aparecieron los maestros albañiles");
  }
};

export const obtenermaestroAlbanil = async (req, res) => {
  try {
    const [rows] = await conexion.query("SELECT * FROM maestros_albaniles WHERE id = ?", [
      req.params.id,
    ])
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("No aparecio el Maestro albanil");
  }
}

export const insertarmaestrosAlbaniles = async (req, res) => {
  try {
    const [rows] = await conexion.query(
      "INSERT INTO `maestros_albaniles` SET ?",
      req.body
    );
    res.send({
      id: rows.insertId,
      ...req.body,
    });
  } catch (error) {
    
  }
}

export const eliminarmaestroAlbanil = async (req, res) => {
  try {
    const [eliminar] = await conexion.query("DELETE FROM maestros_albaniles WHERE id = ?",[
      req.params.id
    ]);
    if (eliminar.affectedRows <= 0) return res.status(404).json({
      menssage: 'No se encontro el maestro albañil'
    })
    res.send('Maestro albañil eliminado')
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudo eliminar el Maestro albañil");
  }
}