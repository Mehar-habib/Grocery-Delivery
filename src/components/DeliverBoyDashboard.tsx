"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  User,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";

const DeliverBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const result = await axios.get("/api/delivery/get-assignments");
        setAssignments(result.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // const handleAccept = async (assignmentId: string) => {
  //   try {
  //     await axios.post(`/api/delivery/accept/${assignmentId}`);
  //     setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleReject = async (assignmentId: string) => {
  //   try {
  //     await axios.post(`/api/delivery/reject/${assignmentId}`);
  //     setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const formatTime = (date: string) => {
    const diffMinutes = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60),
    );
    return diffMinutes < 60
      ? `${diffMinutes} min ago`
      : `${Math.floor(diffMinutes / 60)} hr ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Heading */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-2">
        <h1 className="text-3xl text-center pb-3 pt-6 font-bold text-gray-800">
          Delivery Dashboard
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-2">
        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              No Orders Available
            </h2>
            <p className="text-sm text-gray-500">
              Check back later for new deliveries
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-xl cursor-pointer border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-800">
                        Order #{assignment.order._id.slice(-8)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatTime(assignment.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4 space-y-3">
                  {/* Customer */}
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-800">
                        {assignment.order.address.fullName}
                      </span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-600">
                        {assignment.order.address.mobile}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-600 flex-1">
                      {assignment.order.address.fullAddress}
                    </p>
                  </div>

                  {/* Items Count & Total */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-600">
                      {assignment.order.items.length}{" "}
                      {assignment.order.items.length === 1 ? "item" : "items"}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-green-600 font-bold text-lg">
                        Rs.
                      </span>
                      <span className="font-semibold text-gray-800 text-lg">
                        {assignment.order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      // onClick={() => handleAccept(assignment._id)}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      // onClick={() => handleReject(assignment._id)}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliverBoyDashboard;
