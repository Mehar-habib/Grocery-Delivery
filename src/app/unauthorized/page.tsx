"use client";

import { ShieldX, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-white to-orange-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full backdrop-blur-xl bg-white/80 border border-white/40 shadow-2xl rounded-3xl p-10 text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-100 text-red-600">
            <ShieldX size={40} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>

        <p className="text-gray-500 mt-3 text-sm md:text-base">
          You don’t have permission to access this page. Please contact the
          administrator if you believe this is a mistake.
        </p>

        {/* Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
          >
            <ArrowLeft size={18} />
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
