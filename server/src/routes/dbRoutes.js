import { clearDBController, getusers, recieve_budget_details, send_budget_details_controller, drop_user_budget_controller, email_alert_Controller } from "../controllers/dbController.js";
import express from "express";
import { verifyJWT } from "../services/login.js";


const dbRouter = express.Router();
dbRouter.post("/clear", clearDBController);

dbRouter.get("/getuser",verifyJWT, getusers)

dbRouter.post("/create_budget", verifyJWT, recieve_budget_details);

dbRouter.get("/send_budget_details", verifyJWT, send_budget_details_controller);

dbRouter.delete("/drop_budget", verifyJWT, drop_user_budget_controller);

dbRouter.post("/email_alert", verifyJWT, email_alert_Controller);

export default dbRouter;