import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, socketId } = await req.json();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        socketId,
        isOnline: true,
      },
      { new: true },
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong ${error}` },
      { status: 500 },
    );
  }
}
