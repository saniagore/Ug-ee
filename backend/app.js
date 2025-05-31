import { PORT } from "./config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import usuarioRoutes from "./routes/usuario.routes.js";
import institucionRoutes from "./routes/institucion.routes.js";
import conductorRoutes from "./routes/conductor.routes.js";
import viajeRoutes from "./routes/viaje.routes.js";
import vehiculoRoutes from "./routes/vehiculo.routes.js";
import reservaRoutes from "./routes/reserva.routes.js";
import calificacionRoutes from "./routes/calificacion.routes.js";
import reporteRoutes from "./routes/reporte.routes.js";

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use("/api/usuario", usuarioRoutes);
app.use("/api/institucion", institucionRoutes);
app.use("/api/conductor", conductorRoutes);
app.use("/api/viaje", viajeRoutes);
app.use("/api/vehiculo", vehiculoRoutes);
app.use("/api/reserva", reservaRoutes);
app.use("/api/calificacion", calificacionRoutes);
app.use("/api/reporte", reporteRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

export default app;