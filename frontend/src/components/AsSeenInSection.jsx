import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    text: "The sarong gives a nice look. Fabric is light and semi-transparent. Looks same as in picture.",
    author: "Emily Davis",
    location: "Los Angeles, CA",
  },
  {
    text: "Excellent quality and perfect fit. The customer service was outstanding!",
    author: "Sarah Johnson",
    location: "New York, NY",
  },
  {
    text: "I love the variety Clothify offers! The fabrics are so comfortable, and delivery was quick.",
    author: "Michael Brown",
    location: "Chicago, IL",
  },
  {
    text: "I ordered a linen shirt, and it's perfect for summer. Feels soft, and the size was spot on!",
    author: "Jessica Lee",
    location: "Austin, TX",
  },
  {
    text: "The customization options for formal wear blew my mind. I got a perfectly tailored blazer that looks premium.",
    author: "David Wilson",
    location: "San Francisco, CA",
  },
  {
    text: "Clothify exceeded my expectations! The prices are reasonable, and the quality is unmatched. Highly recommended!",
    author: "Sophia Martinez",
    location: "Miami, FL",
  },
  {
    text: "I had an issue with my order, but the support team was so helpful. They resolved it in no time. Amazing service!",
    author: "Chris Anderson",
    location: "Seattle, WA",
  },
  {
    text: "Bought a pair of joggers, and they’re now my go-to for casual outings. Super comfy and stylish!",
    author: "Rachel Kim",
    location: "Denver, CO",
  },
];

const AsSeenInSection = () => {
  return (
    <section className="py-16 px-4 bg-pink-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
          As seen in
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center mb-20">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/logos/gucci.png"
            alt="Gucci"
            className="h-10 md:h-16 w-auto opacity-80 hover:opacity-100"
          />
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/logos/vogue.png"
            alt="Vogue"
            className="h-10 md:h-16 w-auto opacity-80 hover:opacity-100"
          />
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/logos/lacoste.png"
            alt="Lacoste"
            className="h-16 md:h-28 w-auto opacity-80 hover:opacity-100"
          />
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/logos/nike.png"
            alt="nike"
            className="h-10 md:h-16 w-auto opacity-80 hover:opacity-100"
          />
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/logos/chanel.png"
            alt="Chanel"
            className="h-10 md:h-16 w-auto opacity-80 hover:opacity-100"
          />
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/logos/levis.png"
            alt="levis"
            className="h-10 md:h-16 w-auto opacity-80 hover:opacity-100"
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-6">
            Don't take just our words
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Hear from our customer's experience.
          </p>

          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="text-center px-6 md:px-12">
                    <div className="text-6xl text-gray-300 font-serif mb-6">
                      "
                    </div>
                    <p className="text-lg md:text-xl text-gray-700 mb-6">
                      {testimonial.text}
                    </p>
                    <div className="text-gray-600">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p>{testimonial.location}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-center gap-4 mt-8">
              <CarouselPrevious variant="outline" size="sm" />
              <CarouselNext variant="outline" size="sm" />
            </div>
          </Carousel>
        </div>
        <hr className="mt-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-2">
              Free Standard Delivery
            </h3>
            <p className="text-gray-600">Free delivery on Prepaid orders</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Easy Exchange Policy</h3>
            <p className="text-gray-600">
              7-Day Easy exchange policy on Beachwear, Brallete & Nightwear
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-2">100% Secure Checkout</h3>
            <p className="text-gray-600">
              Shop with confidence with our safe secure SSL certificate and most
              trusted payment gateway
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AsSeenInSection;
