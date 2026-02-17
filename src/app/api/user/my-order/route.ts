import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    await connectDB();
    const session = await auth();
    const orders = await Order.find({ user: session?.user?.id })
      .populate("user assignedDeliveryBoy")
      .sort({ createdAt: -1 });
    if (!orders) {
      return NextResponse.json(
        { message: "Orders not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong ${error}` },
      { status: 500 },
    );
  }
}
