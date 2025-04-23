import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, url, confirmPassword } = await req.json();

    if (!id || !url || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectDb();

    const updated = await PasswordModel.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { url, confirmPassword },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Password not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Password updated successfully", updated },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
