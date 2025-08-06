import express from "express";
import { loginUser } from "../services/login.js";
import { registerUser } from "../services/signup.js";

export async function RegisterController(req, res){
    try {  
        const userId = await registerUser(req.body);
        return res.status(201).json({ status: 1, userId });
      } catch (err) {
        console.error('Signup error:', err);
        return res.status(400).json({ status: 0, error: err.message });
      }
}

export async function LoginController(req, res){
    try{ 
        const {token, user} = await loginUser(req.body.username, req.body.password);
        if (token) {
            res.status(200).json({ token: token , user: user});
        } 
        else {
            res.status(401).send("Invalid credentials");
        }
    } catch (err){
        console.error("Error in Login.js or controller:", err.message);
        res.status(err.message === 'Invalid password' ? 401 : 400).json({
            error: err.message,
          });
    }
}