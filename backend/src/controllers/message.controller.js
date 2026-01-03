import { User } from "../models/User.js";
import { Message } from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";


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
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;
    console.log("IMAGE RECEIVED:", image, typeof image);

    let imageUrl = null;
    if (image && typeof image === "string") {

      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl || null, //  match frontend
    });


    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId && io) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ sendMessage error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getChatPartners = async (req, res) => {
  try {
    const myId = req.user._id;

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: myId }, { receiverId: myId }],
        },
      },
      {
        $project: {
          chatUser: {
            $cond: [
              { $eq: ["$senderId", myId] },
              "$receiverId",
              "$senderId",
            ],
          },
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatUser",
          lastMessageAt: { $first: "$createdAt" },
        },
      },
    ]);

    const userIds = chats.map((c) => c._id);

    const users = await User.find(
      { _id: { $in: userIds } },
      "fullname profilePic"
    );

    res.status(200).json({ chats: users });
  } catch (error) {
    console.error("getChatPartners error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

