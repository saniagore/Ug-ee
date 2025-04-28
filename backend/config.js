export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const SALT_ROUNDS = 10;

export const DB_CONFIG = {
  user: process.env.DB_USER || "admin",
  host: process.env.DB_HOST || "db",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "uguee_db",
  port: parseInt(process.env.DB_PORT) || 5432,
};

export const JWT_SECRET = process.env.JWT_SECRET || '1mX4#bP7z!qN8$KwD@eLf2Rs9HtV0gYcWi6*pZhAjXs3oV&QbMt';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";