// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import {AnimatePresence, motion} from "motion/react"
// import { ArrowLeft, Edit, Search, Upload, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { IGrocery } from "@/models/grocery.model";
// import Image from "next/image";

// const categories = [
//   "Fruits & Vegetables",
//   "Dairy & Eggs",
//   "Rice, Atta & Grains",
//   "Snacks & Biscuits",
//   "Spices & Masalas",
//   "Beverages & Drinks",
//   "Personal Care",
//   "Household Essentials",
//   "Instant & Packaged Food",
//   "Baby & Pet Care",
// ];

// const units = ["kg", "g", "liter", "ml", "piece", "pack"];
// const ViewGrocery = () => {
//     const [groceries, setGroceries] = useState<IGrocery[]>();
//     const [editing, setEditing] = useState<IGrocery | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [backendImage, setBackendImage] = useState<Blob | null>(null);
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//   useEffect(() => {
//     const getGroceries = async () => {
//       try {
//         const result = await axios.get("/api/admin/get-groceries");
//         setGroceries(result.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     getGroceries();
//   }, []);

//   useEffect(() => {
//     if (editing) {
//       setImagePreview(editing.image);
//     }
//   }, [editing]);

//   const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if(file){
//         setBackendImage(file)
//         setImagePreview(URL.createObjectURL(file))
//     }
//   };
//   const handleEdit = async () => {
//     if(!editing) return
//     try {
//          const formData = new FormData();
//       formData.append("groceryId", editing._id?.toString()!);
//       formData.append("name", editing.name);
//       formData.append("category", editing.category);
//       formData.append("unit", editing.unit);
//       formData.append("price", editing.price);
//       if (backendImage) formData.append("image", backendImage);
//       const result = await axios.post("/api/admin/edit-grocery", formData);
//       window.location.reload()
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const handleDelete = async () => {
//     if(!editing) return
//     try {
//       const result = await axios.post("/api/admin/delete-grocery", {groceryId: editing._id})
//       window.location.reload()
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   return <div>
//     <motion.div>
//         <button onClick={() => router.back()}><ArrowLeft/><span>back</span></button>
//         <h1>Manage Groceries</h1>
//     </motion.div>

//     <motion.form>
//         <Search/>
//         <input type="text" />
//     </motion.form>

//     <div>
//         {groceries?.map((g,i)=>(
// <motion.div key={i}>
//             <div>
//                 <Image src={g.image} alt={g.name} />
//             </div>
//             <div>
//                 <div>
//                     <h3>{g.name}</h3>
//                     <p>{g.category}</p>
//                 </div>
//                 <div>
//                    Rs. <p>{g.price} /<span>{g.unit}</span></p>
//                     <button onClick={() => setEditing(g)}><Edit/></button>
//                 </div>
//             </div>
// </motion.div>
//         ))}
//     </div>

//     <AnimatePresence>
//         {editing && (
//             <motion.div>
//                 <div>
//                     <h1>Editing Grocery</h1>
//                     <button onClick={() => setEditing(null)}><X/></button>
//                 </div>

//             <div>
//                 {imagePreview && <Image src={imagePreview} alt={editing.name} />}
//                 <label htmlFor="imageUpload"><Upload/></label>
//                 <input type="file" accept="image/*" hidden id="imageUpload" onChange={handleImageUpload} />
//             </div>
//             <div>
//                 <input type="text" placeholder="Enter Grocer name" onChange={(e)=> setEditing({...editing, name: e.target.value})} value={editing.name} />
//                 <select onChange={(e)=> setEditing({...editing, category: e.target.value})} value={editing.category}>
//                     <option>Select Category</option>
//                     {categories.map((c,i)=>(
//                         <option key={i} value={c}>{c}</option>
//                     ))}
//                 </select>
//                 <input type="text" placeholder="Enter Unit" onChange={(e)=> setEditing({...editing, unit: e.target.value})} value={editing.unit} />
//                 <input type="text" placeholder="Enter Price" onChange={(e)=> setEditing({...editing, price: e.target.value})} value={editing.price} />
//                 <select value={editing.unit} onChange={(e)=> setEditing({...editing, unit: e.target.value})}>
//                     <option>Select Unit</option>
//                     {units.map((u,i)=>(
//                         <option key={i} value={u}>{u}</option>
//                     ))}
//                 </select>
//             </div>
//             <button onClick={handleEdit}>Edit Grocery</button>
//             <button onClick={handleDelete}>Delete Grocery</button>
//             </motion.div>
//         )}
//     </AnimatePresence>
//   </div>;
// };

// export default ViewGrocery;

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Edit,
  Search,
  Upload,
  X,
  Package,
  Tag,
  Scale,
  DollarSign,
  Grid,
  Trash2,
  Save,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IGrocery } from "@/models/grocery.model";
import Image from "next/image";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care",
];

const units = ["kg", "g", "liter", "ml", "piece", "pack"];

const ViewGrocery = () => {
  const [groceries, setGroceries] = useState<IGrocery[]>([]);
  const [filteredGroceries, setFilteredGroceries] = useState<IGrocery[]>([]);
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const getGroceries = async () => {
      try {
        const result = await axios.get("/api/admin/get-groceries");
        setGroceries(result.data);
        setFilteredGroceries(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    getGroceries();
  }, []);

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image);
    }
  }, [editing]);

  useEffect(() => {
    let filtered = groceries;

    if (searchTerm) {
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((g) => g.category === selectedCategory);
    }

    setFilteredGroceries(filtered);
  }, [searchTerm, selectedCategory, groceries]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("groceryId", editing._id?.toString()!);
      formData.append("name", editing.name);
      formData.append("category", editing.category);
      formData.append("unit", editing.unit);
      formData.append("price", editing.price);
      if (backendImage) formData.append("image", backendImage);

      await axios.post("/api/admin/edit-grocery", formData);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    if (!confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      await axios.post("/api/admin/delete-grocery", { groceryId: editing._id });
      window.location.reload();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Manage Groceries
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredGroceries.length} items available
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-green-50 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500">Total Items</p>
                <p className="text-xl font-bold text-green-600">
                  {groceries.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grocery Grid */}
        {filteredGroceries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/50"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-30" />
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-8 inline-block">
                <Package className="w-20 h-20 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Items Found
            </h2>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGroceries.map((grocery, index) => (
              <motion.div
                key={grocery._id?.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-green-50/30 p-4">
                  <Image
                    src={grocery.image}
                    alt={grocery.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-green-600 px-2 py-1 rounded-full border border-green-200">
                    {grocery.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1">
                    {grocery.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Rs. {Number(grocery.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        per {grocery.unit}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditing(grocery)}
                      className="p-2 bg-green-100 rounded-xl hover:bg-green-600 group/edit transition-colors"
                    >
                      <Edit className="w-5 h-5 text-green-600 group-hover/edit:text-white transition-colors" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Grocery Item
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-40 h-40 bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                    {imagePreview && (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain p-2"
                      />
                    )}
                  </div>

                  <label
                    htmlFor="imageUpload"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Upload New Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="imageUpload"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Category and Unit Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={editing.category}
                        onChange={(e) =>
                          setEditing({ ...editing, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                      </label>
                      <select
                        value={editing.unit}
                        onChange={(e) =>
                          setEditing({ ...editing, unit: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                      >
                        <option value="">Select Unit</option>
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      value={editing.price}
                      onChange={(e) =>
                        setEditing({ ...editing, price: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Item
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewGrocery;
