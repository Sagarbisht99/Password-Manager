import { auth } from "@clerk/nextjs/server";
import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectDb();

    const passwords = await PasswordModel.find({ userId });

    if (!passwords || passwords.length === 0) {
      return NextResponse.json({ message: "No passwords found" }, { status: 200 });
    }

    return NextResponse.json({ passwords }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
