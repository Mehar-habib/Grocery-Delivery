"use client";

import { Leaf, ShoppingBasket, Smartphone, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      icon: <Leaf size={60} />,
      title: "Fresh Organic Groceries",
      subTitle:
        "Farm-fresh fruits, vegetables, and daily essentials delivered to your doorstep.",
      btnText: "Shop Now",
      bg: "https://images.unsplash.com/photo-1702770392988-0962cafbfc55?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 2,
      icon: <Truck size={60} />,
      title: "Fast & Reliable Delivery",
      subTitle:
        "Lightning-fast delivery with guaranteed freshness and quality.",
      btnText: "Order Now",
      bg: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=1115&auto=format&fit=crop",
    },
    {
      id: 3,
      icon: <Smartphone size={60} />,
      title: "Shop Anytime, Anywhere",
      subTitle: "Order groceries easily from your mobile, tablet, or desktop.",
      btnText: "Get Started",
      bg: "https://images.unsplash.com/photo-1657288649124-b80bdee3c17e?q=80&w=1471&auto=format&fit=crop",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[80vh] w-[98%] mx-auto mt-28 overflow-hidden rounded-tl-4xl rounded-br-4xl shadow-2xl">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].bg}
            alt="hero background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <motion.div
          key={currentSlide + "-content"}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex justify-center mb-4 text-green-400">
            {slides[currentSlide].icon}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {slides[currentSlide].title}
          </h1>

          <p className="text-gray-200 mt-4 text-sm md:text-lg">
            {slides[currentSlide].subTitle}
          </p>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-8 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
          >
            <ShoppingBasket size={18} />
            {slides[currentSlide].btnText}
          </motion.button>
        </motion.div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-green-500" : "w-2.5 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
