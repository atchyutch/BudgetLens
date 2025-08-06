import bcrypt from 'bcrypt';
import {createconn} from "./database_conn.js";
import jwt from 'jsonwebtoken';


export async function loginUser(username, password){
    let conn;
    try {
      conn = await createconn();
  
      const [results] = await conn.execute(
        'SELECT hashedpassword, user_id FROM users WHERE username = ?', [username]);
        if (results.length === 0){
            console.error("User not found");
            return {token:"Not generated", user: "User not found"};
        } 
    const hashedPassword_retrieved = results[0].hashedpassword; 
    const user_id_retrieved = results[0].user_id;
    const ok = await bcrypt.compare(password, hashedPassword_retrieved);
    if (!ok) throw new Error('Invalid credentials');

    if (ok === true){
        console.log("Login successful");
        const {token, payload} = generateJWT(user_id_retrieved, username);
        // we will send this to the client in future. 
        return {token, user: payload};
    }     
    } finally {
    if (conn) await conn.end();             
    }
}


export function generateJWT(id, username) {
    const payload = {
        "id": id,
        "username": username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
    return {token, payload};
}


export async function verifyJWT(req,res,next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Missing token' });
      }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
  console.error('Plaid 400:', err.response?.data || err);
  return res.status(500).json({ error: 'Plaid create_link_token failed' });
}
}
