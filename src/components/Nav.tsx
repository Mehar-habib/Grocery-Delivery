"use client";

import {
  Boxes,
  ClipboardCheck,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import mongoose from "mongoose";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const profileDropDown = useRef<HTMLDivElement>(null);
  const { cartData } = useSelector((state: RootState) => state.cart);
  const [search, setSearch] = useState("");
  const router = useRouter();

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

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) {
      return router.push("/");
    }
    router.push(`/?q=${encodeURIComponent(query)}`);
    setSearch("");
    setSearchBarOpen(false);
  };

  const SideBar = menuOpen
    ? createPortal(
        <AnimatePresence>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed top-0 left-0 h-full w-[80%] sm:w-[60%] lg:w-[350px] z-[9999]
          bg-gradient-to-b from-green-900 via-green-800 to-green-950
          shadow-2xl border-r border-white/10
          flex flex-col text-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
              <h1 className="font-bold text-xl tracking-wide">Admin Panel</h1>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center text-center px-6 py-6 border-b border-white/10">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-green-400 shadow-lg">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-green-700">
                    <User size={28} />
                  </div>
                )}
              </div>

              <h2 className="mt-4 font-semibold text-lg">{user.name}</h2>
              <p className="text-sm text-green-300 capitalize">{user.role}</p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-3 px-6 py-6 flex-1">
              <Link
                href="/admin/add-grocery"
                className="flex items-center gap-3 px-4 py-3 rounded-xl
              bg-white/5 hover:bg-white/15 transition-all duration-200"
              >
                <PlusCircle size={20} />
                <span>Add Grocery</span>
              </Link>

              <Link
                href="/admin/view-grocery"
                className="flex items-center gap-3 px-4 py-3 rounded-xl
              bg-white/5 hover:bg-white/15 transition-all duration-200"
              >
                <Boxes size={20} />
                <span>View Grocery</span>
              </Link>

              <Link
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl
              bg-white/5 hover:bg-white/15 transition-all duration-200"
              >
                <ClipboardCheck size={20} />
                <span>Manage Orders</span>
              </Link>
            </nav>

            {/* Logout */}
            <div className="px-6 pb-8">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-center gap-2
              bg-red-500 hover:bg-red-600
              py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.aside>
        </AnimatePresence>,
        document.body,
      )
    : null;
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
        {user.role === "user" && (
          <form
            className="hidden md:flex items-center gap-3 bg-white/80 border border-gray-200 rounded-xl px-4 py-2 w-[350px] focus-within:ring-2 focus-within:ring-green-400 transition"
            onSubmit={handleSearch}
          >
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search groceries..."
              className="outline-none bg-transparent text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-5 relative">
          {/* Mobile Search Icon */}
          {user.role === "user" && (
            <>
              <button
                className="md:hidden text-gray-600 hover:text-green-600 transition"
                onClick={() => setSearchBarOpen(true)}
              >
                <Search size={22} />
              </button>

              {/* Cart */}
              <Link
                href="/user/cart"
                className="relative text-gray-600 hover:text-green-600 transition"
              >
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 text-xs bg-green-600 text-white rounded-full px-1.5 py-0.5">
                  {cartData.length}
                </span>
              </Link>
            </>
          )}

          {user.role == "admin" && (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href={"/admin/add-grocery"}
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add Grocery
                </Link>
                <Link
                  href="/admin/view-grocery"
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <Boxes className="h-5 w-5" />
                  View Grocery
                </Link>
                <Link
                  href={"/admin/manage-order"}
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <ClipboardCheck className="h-5 w-5" />
                  Menage Order
                </Link>
              </div>
              <div
                className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <Menu className="text-green-600 w-6 h-6" />
              </div>
            </>
          )}

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
                  {user.role === "user" && (
                    <Link
                      href="/user/my-order"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
                    >
                      <Package size={18} />
                      My Orders
                    </Link>
                  )}

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
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search groceries..."
                className="flex-1 outline-none"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <button onClick={() => setSearchBarOpen(false)}>
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {SideBar}
    </nav>
  );
};

export default Nav;
