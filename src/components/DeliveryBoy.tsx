import connectDB from "@/lib/db";
import DeliverBoyDashboard from "./DeliverBoyDashboard";
import { auth } from "@/auth";
import Order from "@/models/order.model";

const DeliveryBoy = async () => {
  await connectDB();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;
  const order = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOtpVerification: true,
  });

  const today = new Date().toDateString();
  const todayOrders = order.filter(
    (order) => new Date(order.createdAt).toDateString() === today,
  ).length;
  const todaysEarning = todayOrders * 150;
  return (
    <div>
      <DeliverBoyDashboard earning={todaysEarning} />
    </div>
  );
};

export default DeliveryBoy;
