import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are not authorized" },
        { status: 401 },
      );
    }
    const { groceryId } = await req.json();
    const grocery = await Grocery.findByIdAndDelete(groceryId);
    return NextResponse.json(
      { message: "Grocery deleted successfully", grocery },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong ${error}` },
      { status: 500 },
    );
  }
}
