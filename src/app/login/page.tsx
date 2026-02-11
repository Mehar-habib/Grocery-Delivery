"use client";
import {
  EyeIcon,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import googleImage from "../../assets/google.png";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const session = useSession();
  console.log(session);
  const formValidation = email !== "" && password !== "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
      });
      console.log("Login successful");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 px-6 py-8 flex flex-col">
      {/* Center Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-green-700 mt-6"
        >
          Welcome Back
        </motion.h1>

        <p className="text-gray-600 mt-2 flex items-center gap-1">
          Login to Grocery Delivery
          <Leaf size={18} className="text-green-600" />
        </p>

        {/* Form */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-5 w-full max-w-sm mt-8"
        >
          {/* Email */}
          <div className="flex items-center gap-3 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 rounded-xl px-4 py-3 transition">
            <Mail className="text-green-600" size={18} />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full outline-none bg-transparent text-sm text-black"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 rounded-xl px-4 py-3 transition">
            <Lock className="text-green-600" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              className="w-full outline-none bg-transparent text-sm text-black"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {showPassword ? (
              <EyeOff
                size={18}
                className="text-gray-400 cursor-pointer hover:text-orange-500"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeIcon
                size={18}
                className="text-gray-400 cursor-pointer hover:text-orange-500"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          {/* Login Button */}
          <button
            disabled={!formValidation || loading}
            className={`w-full font-semibold p-3 rounded-xl transition-all duration-200 shadow-md ${
              formValidation
                ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="flex-1 h-px bg-gray-200"></span>
            OR
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* Google Button */}
          <button className="flex items-center justify-center gap-3 border border-green-200 bg-green-50 hover:bg-green-100 text-green-600 font-medium p-3 rounded-xl transition">
            <Image src={googleImage} width={20} height={20} alt="Google" />
            Continue with Google
          </button>
        </motion.form>

        {/* Sign In */}
        <p className="mt-6 text-sm text-gray-600 flex items-center gap-1">
          Don&apos;t have an account?
          <LogIn size={16} className="text-green-600" />
          <span
            className="text-green-700 font-medium cursor-pointer hover:text-green-500 hover:font-semibold transition"
            onClick={() => router.push("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
