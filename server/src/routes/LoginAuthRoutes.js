import express from "express";
import { LoginController } from "../controllers/LoginAuthController.js";
import { RegisterController } from "../controllers/LoginAuthController.js";


const Authrouter = express.Router();

Authrouter.post("/login", LoginController);
Authrouter.post("/signup", RegisterController);

export default Authrouter;