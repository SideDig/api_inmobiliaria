import { conexion } from "../db.js";

export const obtenerCategoriasConItems = async (req, res) => {
    try {
        const [categories] = await conexion.query("SELECT DISTINCT categoria FROM items_personalizables");
        const [items] = await conexion.query("SELECT * FROM items_personalizables");

        if (categories.length === 0) {
            return res.status(404).send("Categorías no encontradas");
        }

        const data = categories.map((category) => ({
            id: category.categoria,
            name: category.categoria,
            items: items.filter(item => item.categoria === category.categoria),
        }));

        res.json(data);
    } catch (error) {
        console.error("Error al obtener categorías e ítems:", error);
        res.status(500).send("Error al obtener categorías e ítems");
    }
};

// Obtener todos los ítems personalizables
export const obtenerItems = async (req, res) => {
    try {
        const [rows] = await conexion.query("SELECT * FROM items_personalizables");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener los ítems personalizables:", error);
        res.status(500).send("Error al obtener los ítems personalizables");
    }
};

// Obtener un ítem personalizable por ID
export const obtenerItem = async (req, res) => {
    try {
        const [rows] = await conexion.query("SELECT * FROM items_personalizables WHERE id = ?", [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send("Ítem personalizable no encontrado");
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener el ítem personalizable:", error);
        res.status(500).send("Error al obtener el ítem personalizable");
    }
};

// Insertar un nuevo ítem personalizable
export const insertarItem = async (req, res) => {
    try {
        const [result] = await conexion.query("INSERT INTO items_personalizables SET ?", req.body);
        res.send({
            id: result.insertId,
            ...req.body,
        });
    } catch (error) {
        console.error("Error al insertar el ítem personalizable:", error);
        res.status(500).json({ message: "Error al insertar el ítem personalizable", error });
    }
};

// Eliminar un ítem personalizable por ID
export const eliminarItem = async (req, res) => {
    try {
        const [result] = await conexion.query("DELETE FROM items_personalizables WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ítem personalizable no encontrado" });
        }
        res.send('Ítem personalizable eliminado');
    } catch (error) {
        console.error("Error al eliminar el ítem personalizable:", error);
        res.status(500).send("Error al eliminar el ítem personalizable");
    }
};


