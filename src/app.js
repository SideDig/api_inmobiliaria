import express from 'express';
import usuariosRoutes from './routes/usuarios.routes.js';
import maestrosAlbanilesRoutes from './routes/maestrosAlbaniles.routes.js';
import propiedadesRoutes from './routes/propiedades.routes.js';
import itemsRoutes from './routes/itemsPersonalizable.routes.js';
import imagenesRoutes from './routes/imgPropiedades.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

const app = express();
import morgan from 'morgan'

app.use(cors({
    origin: "http://localhost:8081",
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'))

//RUTAS
app.use('/routes', usuariosRoutes);
app.use('/routes', maestrosAlbanilesRoutes);
app.use('/routes', propiedadesRoutes);
app.use('/routes', itemsRoutes);
app.use('/routes', authRoutes);
app.use('/routes', imagenesRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message:'Ruta no encontrada'
    })
})

export default app;