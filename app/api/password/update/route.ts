import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // Get user ID from Clerk
    const { id, url, confirmPassword } = await req.json();

    await connectDb();

    // User-specific password update
    const updated = await PasswordModel.findOneAndUpdate(
      { _id: id, userId }, // Add userId filter
      { url, confirmPassword },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Password not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Password updated successfully",
      updated,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}