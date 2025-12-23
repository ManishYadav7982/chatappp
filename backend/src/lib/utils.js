import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const generateToken = (user, res) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set token in HTTP-only cookie
    res.cookie('jwt', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // prevent xss attacks: cross-site scripting 
        sameSite: 'Strict', // CSRF protection
        secure: process.env.NODE_ENV === "development" ? false : true , 
    });
    return token;
}



//http://localhost:5000 is not secure 
//https is secure -> in this s reprent secure 