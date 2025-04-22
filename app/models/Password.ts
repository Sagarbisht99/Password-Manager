import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  url: String,
  confirmPassword: String
});

const PasswordModel = mongoose.models.Password || mongoose.model("Password", passwordSchema);

export default PasswordModel;