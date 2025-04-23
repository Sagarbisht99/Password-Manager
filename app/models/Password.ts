import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    confirmPassword: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in Next.js
const PasswordModel =
  mongoose.models.Password || mongoose.model("Password", passwordSchema);

export default PasswordModel;