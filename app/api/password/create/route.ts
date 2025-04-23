import { auth } from "@clerk/nextjs/server";
import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";
import { NextResponse } from "next/server";

type FormType = {
  url: string;
  confirmPassword: string;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.form || typeof body.form !== "object") {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    const { url, confirmPassword } = body.form as FormType;

    if (!url || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    await connectDb();

    const saved = await PasswordModel.create({
      url,
      confirmPassword,
      userId,
    });

    return NextResponse.json(
      { message: "Password saved successfully!", data: saved },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong while saving password." },
      { status: 500 }
    );
  }
}
