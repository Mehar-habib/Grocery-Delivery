import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignement.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json({ message: "unauthorize" }, { status: 404 });
    }
    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 },
      );
    }
    if (assignment.status !== "brodcasted") {
      return NextResponse.json(
        { message: "Assignment not expired" },
        { status: 404 },
      );
    }
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["brodcasted", "completed"] },
    });
    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "You already assigned to other order" },
        { status: 400 },
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.accepted = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        brodcastedTo: deliveryBoyId,
        status: "brodcasted",
      },
      { $pull: { brodcastedTo: deliveryBoyId } },
    );
    return NextResponse.json(
      { message: "Order accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong ${error}` },
      { status: 500 },
    );
  }
}
