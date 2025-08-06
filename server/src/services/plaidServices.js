import { createconn } from '../services/database_conn.js';

export async function get_trans_function(user_id){
    let conn;
    try{
    conn = await createconn();
    const [rows] = await conn.query("SELECT item_id, encrypted_access_token FROM accounts WHERE user_id = ?", [user_id]);
    if (rows.length === 0) {
        return {item_id:'No accounts found for this user', encrypted_access_token:'No token found for this user'};
    }
    const item_id = rows[0].item_id;
    const encrypted_access_token = rows[0].encrypted_access_token;
    return { item_id, encrypted_access_token };

    }
    finally{
        if (conn) { await conn.end(); }
    } 
}
