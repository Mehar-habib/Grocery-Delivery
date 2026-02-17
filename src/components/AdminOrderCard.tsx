"use client";
import { IUser } from "@/models/user.model";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Phone,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Wallet,
  ShoppingBag,
  MoreVertical,
  UserCheck,
} from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

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

const AdminOrderCard = ({ order }: { order: IOrder }) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<string>(order.status);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const result = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        {
          status,
        },
      );
      setStatus(status);
    } catch (error) {
      console.error(error);
    }
  };

  const statusOptions = [
    "pending",
    "processing",
    "out for delivery",
    "delivered",
    "cancelled",
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "out for delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "out for delivery":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-6"
    >
      {/* Order Header */}
      <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50/50 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Order Info */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Order #{order._id?.toString().slice(-8).toUpperCase()}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(order.createdAt!)}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4" />
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge and Selector */}
          <div className="flex items-center gap-3">
            {/* Current Status Badge */}
            <div
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border ${getStatusColor(status)}`}
            >
              {getStatusIcon(status)}
              {status}
            </div>

            {/* Status Update Dropdown */}
            <div className="relative">
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id?.toString()!, e.target.value)
                }
                className="appearance-none bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl px-4 py-2 pr-10 font-medium text-gray-700 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all cursor-pointer"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
              <MoreVertical className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6 space-y-4">
        {/* Customer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Customer Name */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Customer</p>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {order.address.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  Customer ID: {order.user?._id?.toString().slice(-6)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Contact</p>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {order.address.mobile}
                </p>
                <p className="text-xs text-gray-500">Available on WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Payment</p>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {order.paymentMethod === "cod" ? (
                  <Wallet className="w-5 h-5 text-green-600" />
                ) : (
                  <CreditCard className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
                <p
                  className={`text-xs ${order.isPaid ? "text-green-600" : "text-orange-600"}`}
                >
                  {order.isPaid ? "Paid" : "Pending Payment"}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Location</p>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {order.address.city}
                </p>
                <p className="text-xs text-gray-500">{order.address.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Address */}
        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">
                Delivery Address
              </p>
              <p className="text-sm text-gray-600">
                {order.address.fullAddress}
              </p>
            </div>
          </div>
        </div>

        {order.assignedDeliveryBoy && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <UserCheck size={20} className="text-blue-600" />
              <div className="font-semibold text-gray-800">
                <p>
                  Assigned to : <span>{order.assignedDeliveryBoy.name}</span>
                </p>
                <p className="text-xs text-gray-600">
                  ☎️ +92 {order.assignedDeliveryBoy.mobile}
                </p>
              </div>
            </div>
            <a
              href={`tel:${order.assignedDeliveryBoy.mobile}`}
              className="bg-blue-600 text-white text-xs px-6 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              Call
            </a>
          </div>
        )}

        {/* Order Items Toggle */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group"
          >
            <span className="flex items-center gap-2 text-gray-700 font-medium">
              <Package className="w-5 h-5 text-green-600" />
              {expanded
                ? "Hide Order Items"
                : `View ${order.items.length} Items`}
            </span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors" />
              )}
            </motion.div>
          </button>

          {/* Order Items */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200"
              >
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Item Image */}
                        <div className="relative w-16 h-16 bg-linear-to-br from-gray-50 to-green-50/30 rounded-xl overflow-hidden border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        {/* Item Details */}
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-gray-500">{item.unit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Item Price */}
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ₹{Number(item.price) * item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{item.price}/{item.unit}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Footer with Total Amount */}
        <div className="flex items-center justify-between pt-2">
          {/* Delivery Note */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Truck className="w-4 h-4 text-green-600" />
            <span>
              {status === "delivered"
                ? "Delivered on " + formatDate(order.updatedAt!)
                : status === "cancelled"
                  ? "Order cancelled"
                  : "Estimated delivery: Today"}
            </span>
          </div>

          {/* Total Amount */}
          <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl px-6 py-3 border border-green-100">
            <p className="text-xs text-gray-600 mb-1">Total Amount</p>
            <div className="flex items-center gap-1">
              <span className="text-xl font-semibold text-green-600">Rs.</span>
              <span className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {order.totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrderCard;
