import {createconn} from "./database_conn.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import 'dotenv/config';

export async function registerUser(data) {
  const { email, firstname, lastname, username, password } = data;

  if (!email || !firstname || !lastname || !username || !password) {
    throw new Error('Missing required signup fields');
  }

  const hashed = await bcrypt.hash(password, 10);

  let conn;    // ← declare conn here so it's in scope for finally
  try {
    conn = await createconn();
    const [result] = await conn.execute(
      'INSERT INTO users (user_email, firstname, lastname, username, hashedpassword) VALUES (?,?,?,?,?)',
      [email, firstname, lastname, username, hashed]
    );
    return result.insertId;
  } finally {
    // only attempt to close if we actually got a connection
    if (conn) await conn.end();
  }
}


export async function hashPassword(password){
    const hashedPassword = await bcrypt.hash(password,10);
    return hashedPassword;
}



