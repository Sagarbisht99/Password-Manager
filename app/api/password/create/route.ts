import { auth } from "@clerk/nextjs/server";
import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // Clerk se user ID le rahe hain
    const { form } = await req.json();
    const { url, confirmPassword } = form;
    await connectDb();

    // User-specific password save kar rahe hain
    await PasswordModel.create({
      url,
      confirmPassword,
      userId, // Store the user ID
    });

    return NextResponse.json({ message: "Password saved!" }, { status: 200 });
  } catch (error) {
    console.log(error, "there is a error");
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 400 }
    );
  }
}
