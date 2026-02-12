"use client";

import { LogOut, Package, Search, ShoppingCart, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

const Nav = ({ user }: { user: IUser }) => {
  const [open, setOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const profileDropDown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] z-50">
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-2xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-green-700 tracking-tight"
        >
          Grocery<span className="text-orange-500">Delivery</span>
        </Link>

        {/* Desktop Search */}
        <form className="hidden md:flex items-center gap-3 bg-white/80 border border-gray-200 rounded-xl px-4 py-2 w-[350px] focus-within:ring-2 focus-within:ring-green-400 transition">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search groceries..."
            className="outline-none bg-transparent text-sm w-full"
          />
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-5 relative">
          {/* Mobile Search Icon */}
          <button
            className="md:hidden text-gray-600 hover:text-green-600 transition"
            onClick={() => setSearchBarOpen(true)}
          >
            <Search size={22} />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative text-gray-600 hover:text-green-600 transition"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 text-xs bg-green-600 text-white rounded-full px-1.5 py-0.5">
              0
            </span>
          </Link>

          {/* Profile */}
          <div ref={profileDropDown} className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-green-400 transition relative"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100">
                  <User size={20} />
                </div>
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-4"
                >
                  {/* Profile Info */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt="profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-100">
                          <User />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Orders */}
                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
                  >
                    <Package size={18} />
                    My Orders
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchBarOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 w-full bg-white shadow-lg p-4 flex items-center gap-3 z-50"
          >
            <Search className="text-gray-400" />
            <input
              type="text"
              placeholder="Search groceries..."
              className="flex-1 outline-none"
              autoFocus
            />
            <button onClick={() => setSearchBarOpen(false)}>
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;
