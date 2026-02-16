"use client";

import axios from "axios";
import { ArrowRight, Bike, User, UserCog, Phone, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";

const EditRoleAndMobile = () => {
  const router = useRouter();
  const { update } = useSession();

  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);
  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!selectedRole || mobile.length !== 11) return;

    try {
      setLoading(true);
      await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });
      await update({ role: selectedRole });
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = selectedRole && mobile.length === 11;
  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await axios.get("/api/check-for-admin");
        if (result.data.adminExist) {
          setRoles((prev) => prev.filter((role) => role.id !== "admin"));
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkForAdmin();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50 px-6 py-10">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center"
      >
        Complete Your Profile
      </motion.h1>

      <p className="text-gray-500 mt-2 text-center">
        Select your role and enter mobile number
      </p>

      {/* Roles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 w-full max-w-3xl">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedRole(role.id)}
              className={`cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 border
              ${
                isSelected
                  ? "bg-green-600 text-white shadow-xl border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:shadow-md"
              }`}
            >
              <Icon size={32} />
              <span className="mt-3 font-semibold">{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-10 w-full max-w-md"
      >
        <label className="text-sm text-gray-600 mb-2 block">
          Mobile Number
        </label>

        <div className="flex items-center gap-3 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 rounded-xl px-4 py-3 transition">
          <Phone size={18} className="text-green-600" />
          <input
            type="tel"
            placeholder="03001234567"
            maxLength={11}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            className="w-full outline-none bg-transparent text-sm text-black"
          />
        </div>

        {mobile.length > 0 && mobile.length !== 11 && (
          <p className="text-xs text-red-500 mt-2">
            Mobile number must be 11 digits
          </p>
        )}
      </motion.div>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={!isValid || loading}
        onClick={handleEdit}
        className={`mt-10 w-full max-w-md flex items-center justify-center gap-2 font-semibold p-3 rounded-xl transition-all duration-300 shadow-md cursor-pointer
          ${
            isValid
              ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <>
            Go to Home <ArrowRight size={18} />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default EditRoleAndMobile;
