"use client";
import { RootState } from "@/redux/store";
import L, { LatLngExpression } from "leaflet";
import {
  ArrowLeft,
  Building,
  CreditCard,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  User,
  Wallet,
  CheckCircle,
  Truck,
  Shield,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const Checkout = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryFee, finalTotal, cartData } = useSelector(
    (state: RootState) => state.cart,
  );
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log(err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({ ...prev, fullName: userData?.name || "" }));
      setAddress((prev) => ({ ...prev, mobile: userData?.mobile || "" }));
    }
  }, [userData]);

  const DraggableMarker = () => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position as LatLngExpression, 15, { animate: true });
      }
    }, [position, map]);
    return position ? (
      <Marker
        icon={markerIcon}
        position={position as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      />
    ) : null;
  };

  const handleSearchQuery = async () => {
    setSearchLoading(true);
    const provider = new OpenStreetMapProvider();
    const result = await provider.search({ query: searchQuery });
    if (result && result[0]) {
      setPosition([result[0].y, result[0].x]);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        setAddress((prev) => ({
          ...prev,
          city: result.data.address?.city || result.data.address?.town || "",
          state: result.data.address?.state || "",
          pincode: result.data.address?.postcode || "",
          fullAddress: result.data.display_name || "",
        }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchAddress();
  }, [position]);

  const handleCOD = async () => {
    if (!position) return null;
    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log(err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  };

  const isAddressComplete = () => {
    return (
      address.fullName &&
      address.mobile &&
      address.city &&
      address.state &&
      address.pincode &&
      address.fullAddress &&
      position
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/user/cart")}
          className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all mb-8 group"
        >
          <div className="p-1.5 bg-green-100 rounded-xl group-hover:bg-green-500 transition-colors">
            <ArrowLeft className="w-4 h-4 text-green-600 group-hover:text-white transition-colors" />
          </div>
          <span className="font-medium text-gray-700 group-hover:text-green-600">
            Back to Cart
          </span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-xl shadow-green-200/50 mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Almost{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              There!
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your order in a few simple steps
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    activeStep >= step
                      ? "bg-green-600 text-white shadow-lg shadow-green-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {activeStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 2 && (
                  <div
                    className={`w-20 h-1 mx-2 rounded ${
                      activeStep > step ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-4">
                {/* Name and Mobile */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="group">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-100 focus-within:border-green-500 transition-all">
                      <User className="w-5 h-5 text-gray-400 group-focus-within:text-green-500" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={address.fullName}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-100 focus-within:border-green-500 transition-all">
                      <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-green-500" />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={address.mobile}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            mobile: e.target.value,
                          }))
                        }
                        className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Full Address */}
                <div className="group">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-100 focus-within:border-green-500 transition-all">
                    <Home className="w-5 h-5 text-gray-400 group-focus-within:text-green-500" />
                    <input
                      type="text"
                      placeholder="House/Flat No., Building, Street"
                      value={address.fullAddress}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          fullAddress: e.target.value,
                        }))
                      }
                      className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* City, State, Pincode */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="group">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-100 focus-within:border-green-500 transition-all">
                      <Building className="w-5 h-5 text-gray-400 group-focus-within:text-green-500" />
                      <input
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-100 focus-within:border-green-500 transition-all">
                      <Navigation className="w-5 h-5 text-gray-400 group-focus-within:text-green-500" />
                      <input
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-100 focus-within:border-green-500 transition-all">
                      <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-green-500" />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={address.pincode}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            pincode: e.target.value,
                          }))
                        }
                        className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Map Section */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search for your area..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSearchQuery()
                        }
                        className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-100 focus:border-green-500 outline-none transition-all"
                      />
                      <button
                        onClick={handleSearchQuery}
                        disabled={searchLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {searchLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCurrentLocation}
                      className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                      title="Use current location"
                    >
                      <LocateFixed className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Map Container */}
                  <div className="relative h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                    {position ? (
                      <MapContainer
                        center={position as LatLngExpression}
                        zoom={13}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <DraggableMarker />
                      </MapContainer>
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">Loading map...</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-500 rounded-full" />
                    Drag the marker to adjust your exact location
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Payment Method
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod("online")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "online"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        paymentMethod === "online"
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <CreditCard
                        className={`w-5 h-5 ${
                          paymentMethod === "online"
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Pay Online</p>
                      <p className="text-xs text-gray-500">
                        Credit/Debit Card, UPI
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "cod"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        paymentMethod === "cod" ? "bg-green-600" : "bg-gray-200"
                      }`}
                    >
                      <Wallet
                        className={`w-5 h-5 ${
                          paymentMethod === "cod"
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-gray-500">
                        Pay when you receive
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>

              {paymentMethod === "online" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 bg-blue-50 rounded-xl"
                >
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Secure payment powered by Stripe. Your payment info is
                    encrypted.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Order Summary - 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="w-7 h-7 text-green-600" />
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-semibold">Rs.{subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1 font-semibold">
                    <Truck className="w-5 h-5 text-green-500" />
                    Delivery Fee
                  </span>
                  <span className="font-semibold">Rs.{deliveryFee}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Rs.{finalTotal}
                  </span>
                </div>
                Delivery Time Estimate
                <div className="bg-green-50 rounded-xl p-4 mt-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Estimated Delivery
                      </p>
                      <p className="text-xs text-gray-600">
                        Your parcel will be delivered within the next three
                        days.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Place Order Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (paymentMethod === "cod") {
                      handleCOD();
                    } else {
                      null;
                      // handleOnlineOrder()
                    }
                  }}
                  disabled={!isAddressComplete() || isPlacingOrder}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                    isAddressComplete() && !isPlacingOrder
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-green-500/30 hover:shadow-green-500/40"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : paymentMethod === "cod" ? (
                    "Place Order"
                  ) : (
                    "Pay & Place Order"
                  )}
                </motion.button>
                {!isAddressComplete() && (
                  <p className="text-xs text-red-500 font-semibold text-center mt-2">
                    Please complete all address fields to continue
                  </p>
                )}
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <Shield className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Secure</p>
                  </div>
                  <div className="text-center">
                    <Truck className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Free Delivery</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">30 Min</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
