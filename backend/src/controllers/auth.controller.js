import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import { senderWelcomeEmail } from '../emails/emailsHandlers.js';
import dot from 'dotenv';
dot.config();

export const signUp = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }

        const user = await User.findOne({ email }); // check in db if user already exists

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });

        if (newUser) {

             await newUser.save();
            generateToken(newUser._id, res);
            //generate token for the user

           
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
                message: "User created successfully"
            });

            
            //send welcome email to the user
            try {
                await senderWelcomeEmail(newUser.email, newUser.fullname, process.env.CLIENT_URL);
            } catch (error) {
                console.log("Error sending welcome email: ", error);
            }
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }



    } catch (error) {
        console.log("Error in signUp controller: ", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }


};