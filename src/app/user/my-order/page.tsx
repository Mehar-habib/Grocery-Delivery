// "use client";
// import UserOrderCard from "@/components/UserOrderCard";
// import { IOrder } from "@/models/order.model";
// import axios from "axios";
// import {
//   ArrowLeft,
//   Package,
//   PackageSearch,
//   ShoppingBag,
//   Filter,
//   Clock,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "motion/react";

// const MyOrder = () => {
//   const router = useRouter();
//   const [orders, setOrders] = useState<IOrder[]>();
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState<string>("all");

//   useEffect(() => {
//     const getMyOrders = async () => {
//       try {
//         const result = await axios.get("/api/user/my-order");
//         setOrders(result.data);
//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     };
//     getMyOrders();
//   }, []);

//   const filteredOrders = orders?.filter((order) =>
//     filterStatus === "all" ? true : order.status === filterStatus,
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative w-24 h-24 mx-auto mb-6">
//             <div className="absolute inset-0 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
//             <Package className="w-10 h-10 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
//           </div>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//             Loading Your Orders
//           </h2>
//           <p className="text-gray-500">
//             Please wait while we fetch your order history...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
//       {/* Decorative Background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
//       </div>

//       {/* Fixed Header */}
//       <motion.div
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-20">
//             {/* Back Button */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push("/")}
//               className="flex items-center gap-3 bg-white shadow-md hover:shadow-lg rounded-2xl px-4 py-2.5 transition-all group"
//             >
//               <div className="p-1.5 bg-green-100 rounded-xl group-hover:bg-green-500 transition-colors">
//                 <ArrowLeft className="w-4 h-4 text-green-600 group-hover:text-white transition-colors" />
//               </div>
//               <span className="font-medium text-gray-700 group-hover:text-green-600">
//                 Back
//               </span>
//             </motion.button>

//             {/* Title */}
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
//                 <ShoppingBag className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
//             </div>

//             {/* Filter Dropdown */}
//             <div className="relative">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="appearance-none bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl px-4 py-2.5 pr-10 font-medium text-gray-700 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all cursor-pointer"
//               >
//                 <option value="all">All Orders</option>
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="out for delivery">Out for Delivery</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//               <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         {/* Empty State */}
//         {filteredOrders?.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 mt-12"
//           >
//             <div className="relative mb-8">
//               <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-30" />
//               <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-8 inline-block">
//                 <PackageSearch className="w-20 h-20 text-green-600" />
//               </div>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">
//               No Orders Found
//             </h2>
//             <p className="text-gray-600 mb-8">
//               Start shopping to see your orders here!
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push("/")}
//               className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-green-500/30 hover:shadow-green-500/40 transition-all inline-flex items-center gap-2"
//             >
//               <ShoppingBag className="w-5 h-5" />
//               Start Shopping
//             </motion.button>
//           </motion.div>
//         ) : (
//           <>
//             {/* Orders Count */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-6 flex items-center justify-between"
//             >
//               <p className="text-gray-600 flex items-center gap-2">
//                 <Clock className="w-4 h-4 text-green-600" />
//                 Showing {filteredOrders?.length}{" "}
//                 {filteredOrders?.length === 1 ? "order" : "orders"}
//               </p>
//               {filterStatus !== "all" && (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   onClick={() => setFilterStatus("all")}
//                   className="text-sm text-green-600 hover:text-green-700 font-medium"
//                 >
//                   Clear Filter
//                 </motion.button>
//               )}
//             </motion.div>

//             {/* Orders List */}
//             <AnimatePresence mode="popLayout">
//               <div className="space-y-6">
//                 {filteredOrders?.map((order, index) => (
//                   <motion.div
//                     key={order._id?.toString()}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, x: -100 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     layout
//                   >
//                     <UserOrderCard order={order} />
//                   </motion.div>
//                 ))}
//               </div>
//             </AnimatePresence>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyOrder;

"use client";
import UserOrderCard from "@/components/UserOrderCard";
import { IOrder } from "@/models/order.model";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  PackageSearch,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const MyOrder = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-order");
        setOrders(result.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
            <Package className="w-10 h-10 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading Your Orders
          </h2>
          <p className="text-gray-500">
            Please wait while we fetch your order history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Fixed Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="flex items-center gap-3 bg-white shadow-md hover:shadow-lg rounded-2xl px-4 py-2.5 transition-all group"
            >
              <div className="p-1.5 bg-green-100 rounded-xl group-hover:bg-green-500 transition-colors">
                <ArrowLeft className="w-4 h-4 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-medium hidden sm:block text-gray-700 group-hover:text-green-600">
                Back
              </span>
            </motion.button>

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
            </div>

            {/* Empty div for spacing to keep title centered */}
            <div className="w-[100px]" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Empty State */}
        {orders?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 mt-12"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-30" />
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-8 inline-block">
                <PackageSearch className="w-20 h-20 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Orders Found
            </h2>
            <p className="text-gray-600 mb-8">
              Start shopping to see your orders here!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-green-500/30 hover:shadow-green-500/40 transition-all inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Orders Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-green-600" />
              <p className="text-gray-600">
                Showing {orders?.length}{" "}
                {orders?.length === 1 ? "order" : "orders"}
              </p>
            </motion.div>

            {/* Orders List */}
            <AnimatePresence mode="popLayout">
              <div className="space-y-6">
                {orders?.map((order, index) => (
                  <motion.div
                    key={order._id?.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    layout
                  >
                    <UserOrderCard order={order} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
