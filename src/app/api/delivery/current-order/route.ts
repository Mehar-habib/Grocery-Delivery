import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignement.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    const activeAssignment = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: "assigned",
    })
      .populate({
        path: "order",
        model: Order,
      })
      .lean();
    if (!activeAssignment) {
      return NextResponse.json({ active: false }, { status: 404 });
    }
    return NextResponse.json(
      { active: true, assignment: activeAssignment },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: ` Something went wrong ${error}` },
      { status: 500 },
    );
  }
}
