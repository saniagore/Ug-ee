import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, DB_CONFIG } from "../config.js";
import pg from "pg";
const { Pool } = pg;
const pool = new Pool(DB_CONFIG);

const router = Router();





export default router;