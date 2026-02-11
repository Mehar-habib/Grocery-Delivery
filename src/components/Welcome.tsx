"use client";
import { ArrowRight, Bike, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";

const Welcome = ({ nextStep }: { nextStep: (s: number) => void }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Soft Background Glow */}
      <div className="absolute w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30 -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-20 bottom-0 right-0" />

      {/* Logo + Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex items-center gap-3"
      >
        <div className="p-3 bg-green-100 rounded-2xl shadow-md">
          <ShoppingBasket className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 tracking-tight">
          Grocery Delivery
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative mt-6 text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed"
      >
        Fresh groceries, organic produce, and daily essentials delivered quickly
        and safely to your doorstep.
      </motion.p>

      {/* Icons Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative flex items-center justify-center gap-16 mt-12"
      >
        <div className="p-6 bg-white rounded-3xl shadow-lg hover:scale-105 transition duration-300">
          <ShoppingBasket className="w-20 h-20 md:w-24 md:h-24 text-green-600" />
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-lg hover:scale-105 transition duration-300">
          <Bike className="w-20 h-20 md:w-24 md:h-24 text-orange-500" />
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative mt-12"
        onClick={() => nextStep(2)}
      >
        <button className="group flex items-center gap-2 px-8 py-3 text-lg font-semibold text-white bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition duration-300">
          Get Started
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  );
};

export default Welcome;
