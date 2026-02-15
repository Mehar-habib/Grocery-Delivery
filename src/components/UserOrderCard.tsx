"use client";
import { IOrder } from "@/models/order.model";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Truck,
  Wallet,
  Calendar,
  Clock,
  ShoppingBag,
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const UserOrderCard = ({ order }: { order: IOrder }) => {
  const [expanded, setExpanded] = useState(false);

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
      case "pending":
        return <Clock3 className="w-4 h-4" />;
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
      className="bg-white rounded-2xl border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Order Header */}
      <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50/50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Order Info */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Order #{order?._id?.toString().slice(-8).toUpperCase()}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(order.createdAt!)}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
          </div>

          {/* Status and Payment Badges */}
          <div className="flex items-center gap-3">
            {/* Payment Status */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                order.isPaid
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-orange-50 text-orange-700 border-orange-200"
              }`}
            >
              {order.isPaid ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Clock3 className="w-4 h-4" />
              )}
              {order.isPaid ? "Paid" : "Unpaid"}
            </motion.div>

            {/* Order Status */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border ${getStatusColor(order.status)}`}
            >
              {getStatusIcon(order.status)}
              {order.status}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6 space-y-4">
        {/* Payment Method & Address Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payment Method */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Payment Method</p>
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
                <p className="text-xs text-gray-500">
                  {order.paymentMethod === "cod"
                    ? "Pay when you receive"
                    : "Paid via card/UPI"}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Delivery Address</p>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {order.address.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {order.address.fullAddress}
                </p>
                <p className="text-xs text-gray-500">
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.pincode}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  📱 {order.address.mobile}
                </p>
              </div>
            </div>
          </div>
        </div>

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
                          Rs.{Number(item.price) * item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rs.{item.price}/{item.unit}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Delivery Status */}
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                order.status === "delivered" ? "bg-green-100" : "bg-blue-100"
              }`}
            >
              <Truck
                className={`w-5 h-5 ${
                  order.status === "delivered"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Delivery Status
              </p>
              <p className="text-xs text-gray-500">
                {order.status === "delivered"
                  ? "Delivered on " + formatDate(order.updatedAt!)
                  : order.status === "out for delivery"
                    ? "Out for delivery • Expected today"
                    : "Processing your order"}
              </p>
            </div>
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

export default UserOrderCard;
