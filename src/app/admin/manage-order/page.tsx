"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Package,
  Clock,
  Truck,
  Filter,
} from "lucide-react";
import AdminOrderCard from "@/components/AdminOrderCard";
import { getSocket } from "@/lib/socket";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";

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

const ManageOrder = () => {
  const [orders, setOrders] = useState<IOrder[]>();
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders");
        setOrders(result.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-order", (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders!]);
    });
    return () => socket.off("new-order");
  }, []);

  const getStatusCount = (status: string) => {
    return orders?.filter((order) => order.status === status).length || 0;
  };

  const filteredOrders = orders?.filter((order) => {
    return statusFilter === "all" || order.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
            <Package className="w-10 h-10 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading Orders
          </h2>
          <p className="text-gray-500">
            Please wait while we fetch all orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Fixed Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="flex items-center gap-3 bg-white shadow-md hover:shadow-lg rounded-2xl px-4 py-2.5 transition-all group"
            >
              <div className="p-1.5 bg-green-100 rounded-xl group-hover:bg-green-500 transition-colors">
                <ArrowLeft className="w-4 h-4 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-medium hidden sm:block text-gray-700 group-hover:text-green-600">
                Dashboard
              </span>
            </motion.button>

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Manage Orders
              </h1>
            </div>

            {/* Empty div for spacing */}
            <div className="w-[100px]" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-md">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">
              {orders?.length || 0}
            </p>
          </div>
          <div className="bg-yellow-50/80 backdrop-blur-sm rounded-xl p-4 border border-yellow-200 shadow-md">
            <p className="text-sm text-yellow-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">
              {getStatusCount("pending")}
            </p>
          </div>
          <div className="bg-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-md">
            <p className="text-sm text-purple-600 mb-1">Out for Delivery</p>
            <p className="text-2xl font-bold text-purple-700">
              {getStatusCount("out for delivery")}
            </p>
          </div>
          <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200 shadow-md">
            <p className="text-sm text-green-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-700">
              {getStatusCount("delivered")}
            </p>
          </div>
        </motion.div>

        {/* Filter Tabs - Only Pending & Out for Delivery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
        >
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-green-600 text-white shadow-lg shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              statusFilter === "pending"
                ? "bg-yellow-500 text-white shadow-lg shadow-yellow-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("out for delivery")}
            className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              statusFilter === "out for delivery"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Truck className="w-4 h-4" />
            Out for Delivery
          </button>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-gray-600 flex items-center gap-2">
            <Filter className="w-4 h-4 text-green-600" />
            Showing {filteredOrders?.length} of {orders?.length} orders
          </p>
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Clear Filter
            </button>
          )}
        </motion.div>

        {/* Orders List */}
        <AnimatePresence mode="popLayout">
          {filteredOrders?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 mt-12"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-30" />
                <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-8 inline-block">
                  <Package className="w-20 h-20 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Orders Found
              </h2>
              <p className="text-gray-600">
                No orders match your current filter.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders?.map((order, index) => (
                <motion.div
                  key={order._id?.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <AdminOrderCard key={index} order={order} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageOrder;
