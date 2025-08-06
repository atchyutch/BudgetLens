import { createconn } from "./database_conn.js";
import sgMail from '@sendgrid/mail';
import 'dotenv/config';

export default async function create_budget_backend(user_id, budget_amount, budget_name, budget_category) {
    let conn;
    try{
        const conn = await createconn();
        const [result] = await conn.execute(
            'INSERT INTO budgets (user_id, budget_amount, budget_name, budget_category) VALUES (?,?,?,?)',
            [user_id, budget_amount, budget_name, budget_category]
          );

        return result.insertId;
    }catch(err){
        console.error("Error inserting budget details message fro budget.js:", err);
        throw new Error("Failed to insert budget details");
    }

    finally{
        if (conn) await conn.end();
    }
}

export async function send_budget_details(user_id) {
    let conn;
    try {
        conn = await createconn();
        const [rows] = await conn.execute(
            'SELECT budget_id, budget_amount, budget_name, budget_category FROM budgets WHERE user_id = ?',
            [user_id]
        );
        if (rows.length === 0) {
            return [];
        }

        return rows;
    } catch (err) {
        console.error("Error fetching budget details message from budget.js:", err);
        throw new Error("Failed to fetch budget details");
    } finally {
        if (conn) await conn.end();
    }
}


export async function drop_user_budget(budget_id, user_id, budget_name) {
    let conn;
    try {
        conn = await createconn();
        const [result] = await conn.execute(
            'DELETE FROM budgets WHERE budget_id = ? AND user_id = ? AND budget_name = ?',
            [budget_id, user_id, budget_name]
        );
        return result.affectedRows > 0; // Returns true if a budget was deleted
    } catch (err) {
        console.error("Error deleting budget message from budget.js:", err);
        throw new Error("Failed to delete budget");
    } finally {
        if (conn) await conn.end();
    }
}


export async function send_alert_email(exceed_amount, budget_name, user_id) {
    let conn;
    let budget_owner_email;
    try{
        conn = await createconn();
        const [rows] = await conn.execute('SELECT user_email FROM users WHERE user_id = ?', [user_id]);
        if (rows.length === 0) {
            throw new Error("User not found");
        }
        budget_owner_email = rows[0].user_email;
    }catch(err){
        console.error("Error fetching user email message from budget.js:", err);
        throw new Error("Failed to fetch user email");
    }


    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: `${budget_owner_email}`, // Change to your recipient
        from: 'yourbudgetlens@gmail.com', // Change to your verified sender
        subject: 'Your Budget Lens Alert',
        text: `You have exceded your ${budget_name} budget limit by ${exceed_amount}. Please take necessary actions according to your convenience.`,
        html: `<strong>You have exceded your ${budget_name} budget limit by ${exceed_amount}. Please take necessary actions according to your convenience.</strong>`,
      }
      sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error('SendGrid error response:', error.response.body.errors)
        console.log("error from budget.js file")
      })
}


