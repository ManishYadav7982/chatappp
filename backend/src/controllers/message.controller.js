import { User } from "../models/User.js";
import { Message } from "../models/message.js";
import cloudinary from  "../lib/cloudinary.js" ;


export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find(
      { _id: { $ne: loggedInUserId } },
      "-password -__v"
    );

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getMessagesByChatId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatid } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatid },
        { senderId: userToChatid, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages by chat ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    let imageUrl = null;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      imageUrl
    });

    await newMessage.save();

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllChats = async (req, res) => {
  try {
    const myId = req.user._id;

    // 1️⃣ Find latest message per chat
    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: myId },
            { receiverId: myId }
          ]
        }
      },
      {
        $project: {
          chatUser: {
            $cond: [
              { $eq: ["$senderId", myId] },
              "$receiverId",
              "$senderId"
            ]
          },
          text: 1,
          imageUrl: 1,
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$chatUser",
          lastMessage: { $first: "$text" },
          imageUrl: { $first: "$imageUrl" },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // 2️⃣ Populate user details
    const userIds = chats.map(chat => chat._id);

    const users = await User.find(
      { _id: { $in: userIds } },
      "fullname email avatar"
    );

    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // 3️⃣ Merge chat + user info
    const finalChats = chats.map(chat => ({
      user: userMap[chat._id.toString()],
      lastMessage: chat.lastMessage,
      imageUrl: chat.imageUrl,
      createdAt: chat.createdAt
    }));

    res.status(200).json({ chats: finalChats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
