"use client";
import LiveMap from "@/components/LiveMap";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  Bike,
  CheckCircle,
  IndianRupee,
  Phone,
  User,
} from "lucide-react";
import mongoose from "mongoose";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out for delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

const TrackOrder = ({ params }: { params: { orderId: string } }) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<IOrder>();
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliverBoyLocation, setDeliverBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [estimatedTime, setEstimatedTime] = useState("10-15 min");

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        setOrder(result.data);
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        });
        if (result.data.assignedDeliveryBoy?.location) {
          setDeliverBoyLocation({
            latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
            longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
          });
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getOrder();
  }, [userData?._id, orderId]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliverBoy-location", (data) => {
      setDeliverBoyLocation({
        latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.longitude,
      });
    });
    return () => socket.off("update-deliverBoy-location");
  }, [order]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "out for delivery":
        return "bg-green-100 text-green-700";
      case "delivered":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "out for delivery":
        return <Bike className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Track Order
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                Order #{order._id?.toString().slice(-8).toUpperCase()}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Live Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <LiveMap
            userLocation={userLocation}
            deliverBoyLocation={deliverBoyLocation}
          />
        </motion.div>

        {/* Delivery Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-5 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Delivery Status
            </h3>
            <span className="text-sm font-medium text-green-600">
              {estimatedTime}
            </span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {["Order Placed", "Preparing", "Out for Delivery", "Delivered"].map(
              (step, index) => {
                const isActive =
                  (step === "Out for Delivery" &&
                    order.status === "out for delivery") ||
                  (step === "Delivered" && order.status === "delivered") ||
                  (step === "Preparing" && order.status === "pending");

                const isCompleted =
                  step === "Order Placed" ||
                  (step === "Preparing" &&
                    (order.status === "out for delivery" ||
                      order.status === "delivered")) ||
                  (step === "Out for Delivery" && order.status === "delivered");

                return (
                  <div key={step} className="flex-1 text-center">
                    <div className={`relative mb-2`}>
                      <div
                        className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500"
                            : isActive
                              ? "bg-green-500 animate-pulse"
                              : "bg-gray-200"
                        }`}
                      >
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      {index < 3 && (
                        <div
                          className={`absolute top-3 left-[60%] w-full h-0.5 ${
                            index < 2 ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{step}</p>
                  </div>
                );
              },
            )}
          </div>
        </motion.div>

        {/* Delivery Boy Info */}
        {order.assignedDeliveryBoy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-5 mb-4"
          >
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Bike className="w-5 h-5 text-green-600" />
              Delivery Partner
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {order.assignedDeliveryBoy.name}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {order.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                Contact
              </button>
            </div>
          </motion.div>
        )}

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-5 mb-4"
        >
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-green-600" />
            Delivery Address
          </h3>
          <p className="text-gray-800 font-medium">{order.address.fullName}</p>
          <p className="text-sm text-gray-600 mt-1">
            {order.address.fullAddress}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {order.address.city}, {order.address.state} -{" "}
            {order.address.pincode}
          </p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {order.address.mobile}
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-5"
        >
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-green-600" />
            Order Summary
          </h3>

          <div className="space-y-2 mb-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-gray-800">
                  ₹{Number(item.price) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-green-600" />
                <span className="text-xl font-bold text-gray-800">
                  {order.totalAmount}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-gray-500">Payment</span>
              <span
                className={`font-medium ${order.isPaid ? "text-green-600" : "text-orange-600"}`}
              >
                {order.isPaid ? "Paid" : "Pending"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrder;
