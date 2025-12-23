import express from 'express';
import { getAllContacts } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessagesByChatId, sendMessage } from '../controllers/message.controller.js';
import { getAllChats } from '../controllers/message.controller.js';

const router = express.Router();

// Protect all routes below this middleware
router.use(protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getAllChats);
router.get("/:id", getMessagesByChatId);
router.post('/send/:id', sendMessage);


export default router;
