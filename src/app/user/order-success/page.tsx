"use client";

import { ArrowRight, CheckCircle, Package } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative  shadow-2xl rounded-3xl p-10 max-w-xl w-full text-center overflow-hidden"
      >
        {/* Glow Background Effect */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-40" />

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
          className="relative flex items-center justify-center mb-6"
        >
          <div className="absolute w-28 h-28 bg-green-100 rounded-full blur-2xl opacity-70" />
          <div className="relative bg-green-500 text-white p-6 rounded-full shadow-lg">
            <CheckCircle size={40} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Order Placed Successfully 🎉
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 leading-relaxed mb-8"
        >
          Thank you for shopping with us! Your order has been placed and is
          being processed. You can track its progress in your{" "}
          <span className="font-semibold text-black">My Orders</span> section.
        </motion.p>

        {/* Floating Package Animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-8 text-green-500"
        >
          <Package size={48} />
        </motion.div>

        {/* CTA Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-linear-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            Go to My Orders <ArrowRight size={18} />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
