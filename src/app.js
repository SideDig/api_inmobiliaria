import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";
import maestrosAlbanilesRoutes from "./routes/maestrosAlbaniles.routes.js";
import propiedadesRoutes from "./routes/propiedades.routes.js";
import itemsRoutes from "./routes/itemsPersonalizable.routes.js";
import imagenesRoutes from "./routes/imgPropiedades.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Rutas
app.use("/routes", usuariosRoutes);
app.use("/routes", maestrosAlbanilesRoutes);
app.use("/routes", propiedadesRoutes);
app.use("/routes", itemsRoutes);
app.use("/routes", authRoutes);
app.use("/routes", imagenesRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Ocurrió un error en el servidor." });
});

export default app;
