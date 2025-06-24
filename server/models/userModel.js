import { query } from "../config/database.js";
import bcrypt from "bcrypt";

export const createUser = async ({ name, email, phone, address, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (name, email, phone, address, password)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, address, created_at`,
    [name, email, phone, address, hashedPassword]
  );

  return result.rows[0];
};

export const getUsers = async () => {
  const result = await query(
    "SELECT id, name, email FROM users ORDER BY created_at DESC"
  );
  return result.rows;
};
