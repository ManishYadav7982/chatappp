import express from 'express';

const router = express.Router();
import { signUp } from '../controllers/auth.controller.js';

// Define your authentication routes here


router.post("/signup" , signUp );

// router.get("/login", (req, res) => {
//   res.send("Login route");
// });
 

// router.get("/logout", (req, res) => {
//   res.send("Logout route");
// });


export default router;
