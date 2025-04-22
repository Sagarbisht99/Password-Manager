import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const passwords = await PasswordModel.find();
    return NextResponse.json({ passwords }, { status: 200 });
  } catch (error) {
    console.log("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch passwords" },
      { status: 500 }
    );
  }
}
