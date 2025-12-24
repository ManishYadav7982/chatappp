import express from 'express';
import cookieparser from 'cookie-parser';
import Path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
dotenv.config();


import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connect } from 'http2';

const app = express();

const __dirname = Path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors({ origin: process.env.CLIENT_URL , credentials: true })); // Enable CORS
app.use(cookieparser());

app.use("/api/auth" , authRoutes);
app.use("/api/messages" , messageRoutes);


//make ready for depoyment
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(Path.join(__dirname , '../frontend/dist')));

  app.get('*' , (req,res) => {
    res.sendFile(Path.join(__dirname , '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
  connectDB();
});

