import { conexion } from '../db.js';

export const insertarImg = async (req, res) => {
    const { propiedad_id, url_imagen } = req.body;

    try {
        const query = `INSERT INTO imagenes_propiedades (propiedad_id, url_imagen) VALUES (?, ?)`;
        await conexion.execute(query, [propiedad_id, url_imagen]);

        res.status(201).json({ message: 'Imagen creada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getImagenesByPropiedad = async (req, res) => {
    const { propiedadId } = req.params;

    try {
        const [imagenes] = await conexion.execute('SELECT * FROM imagenes_propiedades WHERE propiedad_id = ?', [propiedadId]);
        res.json(imagenes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getImagenById = async (req, res) => {
    const { id } = req.params;

    try {
        const [imagen] = await conexion.execute('SELECT * FROM imagenes_propiedades WHERE id = ?', [id]);
        if (imagen.length === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        res.json(imagen[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteImagen = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM imagenes_propiedades WHERE id = ?`;
        const [result] = await conexion.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        res.json({ message: 'Imagen eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
