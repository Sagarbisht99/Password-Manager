import { auth } from "@clerk/nextjs/server";
import { connectDb } from "@/app/utils/dbConnect";
import PasswordModel from "@/app/models/Password";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Handle POST Request (to delete)
export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // Get userId from Clerk
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400 });
    }

    await connectDb();

    // User-specific password deletion
    const result = await PasswordModel.deleteOne({ _id: new ObjectId(id), userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log("Error in delete route:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}