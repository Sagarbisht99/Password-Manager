// /app/api/password/update/route.ts
import { NextResponse } from "next/server";
import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";

export async function POST(req: Request) {
  try {
    const { id, url, confirmPassword } = await req.json();

    await connectDb();

    const updated = await PasswordModel.findByIdAndUpdate(
      id,
      { url, confirmPassword },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Password not found" },
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
