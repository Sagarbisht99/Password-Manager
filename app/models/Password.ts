import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  url: String,
  confirmPassword: String,
  userId: { type: String, required: true }  // Added userId field
});

const PasswordModel = mongoose.models.Password || mongoose.model("Password", passwordSchema);

export default PasswordModel;
