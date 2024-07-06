import { conexion } from "../db.js";

export const obtenerItems = async (req, res) => {
    try {
        const [rows] = await conexion.query("SELECT * FROM items_personalizables");
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("No aparecen los items")
    }
};

export const obtenerItem = async (req, res) => {
    try {
        const [rows] = await conexion.query("SELECT * FROM items_personalizables WHERE id = ?", [
            req.params.id,
        ])
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("No aparece el item")
    }
};

export const insertarItem = async (req, res) => {
    try {
        const [rows] = await conexion.query(
            "INSERT INTO `items_personalizables` SET ?",
            req.body
        )
        res.send({
            id: rows.insertId,
            ...req.body
        })
    } catch (error) {
        res.status(500).json({ message: "Error al insertar el item", error });
    }
};

export const eliminaritem = async (req, res) => {
    try {
        const [eliminar] = await conexion.query("DELETE FROM `items_personalizables` WHERE id = ?", [
            req.params.id
        ]);
        if (eliminar.affectedRows <= 0) return res.status(400).json({ 
            message: "No se encontro el item"
        })
        res.send('Item eliminado')
    } catch (error) {
        console.error(error);
        res.status(500).send("No se pudo eliminar el item");
    }
}