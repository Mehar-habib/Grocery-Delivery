"use client";

import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBasket,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-white px-4 md:px-10 py-8">
      {/* Back */}
      <Link
        href="/"
        className="flex items-center gap-2 text-green-700 font-medium hover:underline"
      >
        <ArrowLeft size={18} /> Back to Home
      </Link>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 text-2xl md:text-4xl font-bold text-green-800 mt-6 mb-10"
      >
        <ShoppingCart size={50} /> Your Shopping Cart
      </motion.h2>

      {cartData.length === 0 ? (
        /* ================= EMPTY CART ================= */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl p-10 text-center"
        >
          <ShoppingBasket size={60} className="text-green-500 mb-4" />
          <p className="text-gray-600 mb-6 text-lg">
            Your cart is empty. Add some groceries to continue shopping!
          </p>
          <Link
            href="/"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition"
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        /* ================= CART WITH ITEMS ================= */
        <div className="grid md:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            <AnimatePresence>
              {cartData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col sm:flex-row gap-5"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 128px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex  justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.unit}</p>
                      <p className="mt-2 font-bold text-green-600 text-lg">
                        Rs. {Number(item.price) * item.quantity}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center  gap-4 mt-4">
                      <div className="flex items-center border rounded-xl overflow-hidden">
                        <button
                          onClick={() => dispatch(decreaseQuantity(item._id))}
                          className="px-3 py-2 hover:bg-gray-100 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(increaseQuantity(item._id))}
                          className="px-3 py-2 hover:bg-gray-100 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>Rs. {finalTotal}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
              onClick={() => router.push("/user/checkout")}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
