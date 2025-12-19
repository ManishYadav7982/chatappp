import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';

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

            //todo : send welcome email to the user
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }



    } catch (error) {
        console.log("Error in signUp controller: ", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }


};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!email || !password) {
            return  res.status(400).json({ message: "All fields are required" });
        }
        

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
            //never tell the the client whether its email or password is incorrect
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
            message: "Login successful"
        });


    }
    catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};

export const logout = async (_, res) => {
    res.cookie("jwt", "", {maxAge:0}); //overwriting the cookie with empty value and immediate expiry
    res.status(200).json({ message: "Logout successful" });
};