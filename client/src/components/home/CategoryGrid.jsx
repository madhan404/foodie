import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const defaultCategories = [
  { name: "Fast Food", icon: "🍔", color: "from-red-400 to-red-600" },
  { name: "Pizza", icon: "🍕", color: "from-yellow-400 to-orange-500" },
  { name: "Asian", icon: "🍜", color: "from-green-400 to-green-600" },
  { name: "Mexican", icon: "🌮", color: "from-pink-400 to-pink-600" },
  { name: "Italian", icon: "🍝", color: "from-purple-400 to-purple-600" },
  { name: "Dessert", icon: "🍰", color: "from-blue-400 to-blue-600" },
  { name: "Healthy", icon: "🥗", color: "from-emerald-400 to-emerald-600" },
  { name: "Coffee", icon: "☕", color: "from-amber-400 to-amber-600" },
];

export default function CategoryGrid({ categories, selectedCategory, setSelectedCategory, isLoading }) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className={`h-20 flex-col gap-2 ${
            selectedCategory === "all" 
              ? "bg-orange-500 hover:bg-orange-600 text-white" 
              : "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
          }`}
        >
          <span className="text-2xl">🍽️</span>
          <span className="text-xs font-medium">All</span>
        </Button>
        
        {displayCategories.map((category, index) => (
          <motion.div
            key={category.id || category.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id || category.name)}
              className={`h-20 flex-col gap-2 group transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
              }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {category.icon || "🍽️"}
              </span>
              <span className="text-xs font-medium">{category.name}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}