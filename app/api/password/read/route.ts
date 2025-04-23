import { auth } from "@clerk/nextjs/server";
import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    console.log("Fetched userId:", userId);  // Log the userId

    await connectDb();

    // Fetch user-specific passwords
    const passwords = await PasswordModel.find({ userId });
    console.log("Fetched passwords:", passwords);  // Log the passwords

    return NextResponse.json({ passwords }, { status: 200 });
  } catch (error) {
    console.log("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch passwords" },
      { status: 500 }
    );
  }
}

