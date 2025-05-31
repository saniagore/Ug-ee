import app from "./app.js";
import { PORT } from "./config.js";

const server = app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

export default server;