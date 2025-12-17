import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true  },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    avatar: { type: String },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields
export const User = mongoose.model("User", userSchema);

export default User;