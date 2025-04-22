import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { form } = await req.json();
    const { url, confirmPassword } = form;
    console.log(url, confirmPassword);

    await connectDb();

    await PasswordModel.create({
      url,
      confirmPassword,
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