import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const SpecialOffer = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/hero-section-1.webp"
              alt="Special Offer"
              className="rounded-lg w-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <span className="text-sm font-semibold text-yellow-400">
              Limited Time Offer
            </span>
            <h2 className="text-4xl font-bold leading-tight">
              Summer Sale Up to 50% Off
            </h2>
            <p className="text-gray-300 text-lg">
              Don't miss out on our biggest sale of the season. Refresh your
              wardrobe with the latest trends at unbeatable prices.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 flex items-center px-4 sm:px-8"
                onClick={() => navigate("/shop")}
              >
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-gray-500 hover:bg-white hover:text-gray-900 px-4 sm:px-8"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
            <div className="flex gap-8 pt-8">
              <div>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm text-gray-400">Hours</p>
              </div>
              <div>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-gray-400">Minutes</p>
              </div>
              <div>
                <p className="text-3xl font-bold">36</p>
                <p className="text-sm text-gray-400">Seconds</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
