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
    const [eliminar] = await conexion.query("DELETE FROM clientes WHERE id = ?", [
      req.params.id
    ]);
    if (eliminar.affectedRows <= 0) return res.status(404).json({
      menssage: 'No se encontro el cliente'
    })
    res.send('Cliente eliminado')
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudo eliminar el cliente");
  }
};