import pg from "pg";
import bcrypt from "bcryptjs";
import { DB_CONFIG, SALT_ROUNDS } from "../config.js";
import { obtenerInstitucion } from "./institucion.controller.js";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

