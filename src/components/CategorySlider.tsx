"use client";

import {
  Apple,
  Baby,
  Box,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Cookie,
  Flame,
  Heart,
  Home,
  Milk,
  ShoppingCart,
  Wheat,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CategorySlider = () => {
  const categories = [
    {
      id: 1,
      icon: Apple,
      name: "Fruits & Vegetables",
      color: "bg-green-100 text-green-700",
    },
    {
      id: 2,
      icon: Milk,
      name: "Dairy & Eggs",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: 3,
      icon: Wheat,
      name: "Rice, Atta & Grains",
      color: "bg-orange-100 text-orange-700",
    },
    {
      id: 4,
      icon: Cookie,
      name: "Snacks & Biscuits",
      color: "bg-pink-100 text-pink-700",
    },
    {
      id: 5,
      icon: Flame,
      name: "Spices & Masalas",
      color: "bg-red-100 text-red-700",
    },
    {
      id: 6,
      icon: Coffee,
      name: "Beverages & Drinks",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: 7,
      icon: Heart,
      name: "Personal Care",
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: 8,
      icon: Home,
      name: "Household Essentials",
      color: "bg-lime-100 text-lime-700",
    },
    {
      id: 9,
      icon: Box,
      name: "Instant & Packaged Food",
      color: "bg-teal-100 text-teal-700",
    },
    {
      id: 10,
      icon: Baby,
      name: "Baby & Pet Care",
      color: "bg-rose-100 text-rose-700",
    },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    ref.addEventListener("scroll", checkScroll);
    checkScroll();

    return () => {
      ref.removeEventListener("scroll", checkScroll);
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="w-[95%] md:w-[85%] mx-auto mt-14 relative"
    >
      {/* Heading */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-green-100 text-green-600">
          <ShoppingCart size={45} />
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
          Shop by Category
        </h2>
      </div>

      {/* Left Arrow */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 
          bg-white shadow-lg rounded-full p-2 hover:scale-110 transition"
        >
          <ChevronLeft />
        </button>
      )}

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[140px] md:min-w-[160px] cursor-pointer 
              ${cat.color} rounded-2xl shadow-md hover:shadow-xl 
              transition p-4 flex flex-col items-center text-center`}
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full mb-3 text-green-800`}
              >
                <Icon size={35} />
              </div>
              <p className="text-sm font-medium text-gray-700 leading-tight">
                {cat.name}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Right Arrow */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 
          bg-white shadow-lg rounded-full p-2 hover:scale-110 transition"
        >
          <ChevronRight />
        </button>
      )}
    </motion.div>
  );
};

export default CategorySlider;
