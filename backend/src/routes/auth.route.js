import express from 'express';

const router = express.Router();
import { signUp } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';

// Define your authentication routes here


router.post("/signup" , signUp );

router.post("/login", login) ;

router.post("/logout", logout) ;

 

// router.get("/logout", (req, res) => {
//   res.send("Logout route");
// });


export default router;
