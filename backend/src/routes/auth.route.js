import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/auth.controller.js';
import { signUp } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';
import { arcjetMiddleware } from '../middleware/arcjet.middleware.js';


// Define your authentication routes here
const router = express.Router();
router.use(arcjetMiddleware);



router.post("/signup" , signUp );
router.post("/login" , login) ;
router.post("/logout", logout) ;

router.put("/update-profile" , protectRoute, updateProfile);
 
router.get("/check-auth", protectRoute, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});


// router.get("/logout", (req, res) => {
//   res.send("Logout route");
// });


export default router;
