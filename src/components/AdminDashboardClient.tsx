"use client";
import { motion } from "motion/react";
import { ShoppingBag, Users, Clock, TrendingUp, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AdminDashboardClientProps {
  earning: {
    today: number;
    sevenDays: number;
    total: number;
  };
  stats: {
    title: string;
    value: number;
  }[];
  chartData: {
    day: string;
    orders: number;
  }[];
}

const AdminDashboardClient = ({
  earning,
  stats,
  chartData,
}: AdminDashboardClientProps) => {
  const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#ef4444"];

  const pieData = [
    { name: "Delivered", value: 45 },
    { name: "Out for Delivery", value: 25 },
    { name: "Pending", value: 20 },
    { name: "Cancelled", value: 10 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back! Here&apos;s what&apos;s happening with your store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{stat.title}</p>
                {index === 0 && (
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                )}
                {index === 1 && <Users className="w-5 h-5 text-green-600" />}
                {index === 2 && <Clock className="w-5 h-5 text-green-600" />}
                {index === 3 && (
                  <span className="text-green-500 text-lg font-bold">Rs.</span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {index === 3 ? formatCurrency(stat.value) : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100">Today&apos;s Revenue</p>
              <Calendar className="w-5 h-5 text-green-100" />
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(earning.today)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100">Last 7 Days</p>
              <TrendingUp className="w-5 h-5 text-blue-100" />
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(earning.sevenDays)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100">Total Revenue</p>
              <span className="text-white text-lg font-bold">Rs.</span>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(earning.total)}
            </p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Weekly Orders
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Order Status Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg px-6 py-2 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Order Status
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardClient;
