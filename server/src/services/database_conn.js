import mysql from "mysql2/promise";
import 'dotenv/config';


let pool;
export async function createconn() {
  // initialise pool once
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,   // ≤ DB max_connections
      queueLimit: 0
    });
  }

  // grab a pooled connection
  const conn = await pool.getConnection();

  const _release = conn.release.bind(conn);
  conn.end = _release;      // overwrite .end()
  return conn;
}

export async function getuser_name(user_id){
  const conn = await createconn();
  const [rows] = await pool.execute("SELECT firstname, lastname FROM users WHERE user_id = ?", [user_id]);
  // i just want the names so the stucture of [rows] is ?
  // [{ firstname: 'John', lastname: 'Doe' }]

  let user_firstname = " ";
  let user_lastname = " ";
  if (rows.length === 0) {
    return {user_firstname: " ", user_lastname: " "};
  }
  user_firstname = rows[0].firstname; 
  user_lastname = rows[0].lastname;
  await conn.end();
  return {user_firstname, user_lastname};
}

export async function cleardb(){
  const conn = await createconn();
  await conn.query("DELETE FROM users");
  await conn.end();
}
