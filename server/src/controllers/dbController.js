import {cleardb, createconn} from "../services/database_conn.js";
import { getuser_name } from "../services/database_conn.js";
import  create_budget_backend, { send_alert_email }  from "../services/budget.js";
import {send_budget_details}  from "../services/budget.js";
import { drop_user_budget } from "../services/budget.js";

export async function clearDBController(req, res) {
    try{
        await cleardb();
        res.status(200).json({ status: 1, message: "Database cleared successfully" });
    }
    catch(err){
        console.error("Error clearing database:", err);
        res.status(500).json({ status: 0, error: "Failed to clear database" });
    }
}

export async function getusers(req,res){
    const user_id = req.user.id;
    try{
        const {user_firstname, user_lastname} = await getuser_name(user_id);
        res.status(200).json({ status: 1, user_firstname, user_lastname });
        if (user_firstname === " " || user_lastname == " ") {
            throw new Error("User not found");
        }
    }catch(err){
        console.error("Error getting user name:", err);
        res.status(500).json({ status: 0, error: "Failed to get probably because the user does not exist." });
    }
}


export async function recieve_budget_details(req,res){
    const user_id = req.user.id;
    const { budget_amount, budget_name, budget_category } = req.body;
    // we basically need to call that funtion with these parameters.
    const result = create_budget_backend(user_id, budget_amount, budget_name, budget_category);
    return result.then((data) => {
        res.status(200).json({ status: 1, message: "Budget created successfully", data });
    }).catch((err) => {
        console.error("Error creating budget:", err);
        res.status(500).json({ status: 0, error: "Failed to create budget" });
    });   
}

export async function send_budget_details_controller(req, res) {
    const user_id = req.user.id;
    const result = await send_budget_details(user_id);
    if (result.length === 0) {
        return "No budgets found for this user";
    }
    res.status(200).json({ status: 1, message: "Budgets retrieved successfully", data: result });
    // This will return the budget details from the server.
}


export async function drop_user_budget_controller(req, res){
    const user_id = req.user.id;
    const { budget_name, budget_id } = req.body;

    try {
        const result = await drop_user_budget(budget_id,user_id, budget_name);
        if (result) {
            res.status(200).json({ status: 1, message: "Budget deleted successfully" });
        } else {
            res.status(404).json({ status: 0, error: "Budget not found or not deleted" });
        }
    } catch (err) {
        console.error("Error deleting budget:", err);
        res.status(500).json({ status: 0, error: "Failed to delete budget" });
    }
}


export async function email_alert_Controller(req, res) {
    try{
        const { exceeded_amount, budget_id, budget_name} = req.body;
        const user_id = req.user.id;
        await send_alert_email(exceeded_amount, budget_name, user_id);
        res.json({ status: 1, message: "Alert sent" });
    }catch(err){
        console.error("Error sending email alert:", err);
        res.status(500).json({ status: 0, error: "Failed to send email alert" });
    }
}