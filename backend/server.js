import { PORT } from "./config.js";
import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuario.routes.js";
import institucionRoutes from "./routes/institucion.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/usuario", usuarioRoutes);
app.use("/api/institucion", institucionRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});