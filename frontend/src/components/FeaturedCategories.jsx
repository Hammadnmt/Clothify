import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const CategoryCard = ({ title, description, imageUrl }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturedCategories = () => {
  const categories = [
    {
      title: "Summer Collection",
      description: "Light and breezy pieces for the season",
      imageUrl: "/api/placeholder/400/300",
    },
    {
      title: "Formal Wear",
      description: "Professional attire for every occasion",
      imageUrl: "/api/placeholder/400/300",
    },
    {
      title: "Accessories",
      description: "Complete your look with our accessories",
      imageUrl: "/api/placeholder/400/300",
    },
    {
      title: "Athletic Wear",
      description: "Performance meets style",
      imageUrl: "/api/placeholder/400/300",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Featured Categories
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
