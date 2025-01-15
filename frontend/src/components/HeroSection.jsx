import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "Step into Style,",
      subtitle: "Redefine Your Wardrobe",
      description:
        "Discover the latest trends in fashion and enjoy exclusive deals on premium clothing.",
      badge: "New Collection",
      image: "/hero-section-2.webp",
    },
    {
      title: "Premium Essentials",
      subtitle: "Luxury Redefined",
      description:
        "Crafted with precision, our premium essentials combine comfort with sophistication.",
      badge: "Premium",
      image: "/hero-section-4.webp",
    },
    {
      title: "Sustainable Fashion",
      subtitle: "Eco-Friendly Choice",
      description:
        "Join us in making sustainable fashion choices with our eco-conscious collection.",
      badge: "Sustainable",
      image: "/hero-section-5.webp",
    },
  ];

  return (
    <section className="relative bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      <Carousel
        className="w-full"
        opts={{
          loop: true,
          onSelect: (index) => setCurrentIndex(index),
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent>
          {slides.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[80vh] min-h-[600px] w-full">
                <img
                  src={item.image}
                  alt={`Stylish clothing ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />

                <div className="relative z-20 h-full">
                  <div className="container mx-auto px-4 h-full">
                    <div className="flex flex-col justify-center h-full max-w-2xl">
                      <div className="space-y-6">
                        <Badge className="bg-white/90 text-gray-900 hover:bg-white/90">
                          {item.badge}
                        </Badge>

                        <div>
                          <h2 className="text-5xl font-bold text-white mb-2">
                            {item.title}
                          </h2>
                          <p className="text-2xl text-white/90 mb-4">
                            {item.subtitle}
                          </p>
                        </div>

                        <p className="text-lg w-3/5 text-white/80">
                          {item.description}
                        </p>

                        <div className="flex gap-4 pt-4">
                          <Button
                            size="lg"
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 sm:px-8 flex items-center"
                            onClick={() => navigate("/shop")}
                          >
                            Shop Now
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-gray-5 hover:bg-white hover:text-gray-900 px-4 sm:px-8"
                            onClick={() => navigate("/about")}
                          >
                            Learn More
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 pt-6">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 fill-current text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-white/90">
                            4.8/5 from over 1000+ reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? "bg-white" : "bg-white/50"
              }`}
              animate={{ scale: currentIndex === index ? 1.2 : 1 }}
            />
          ))}
        </div> */}
      </Carousel>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 to-white"></div>
    </section>
  );
};

export default HeroSection;

// import Autoplay from "embla-carousel-autoplay";
// import { Button } from "@/components/ui/button";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { useNavigate } from "react-router";

// export default function HeroSection() {
//   const navigate = useNavigate();
//   return (
//     <section className="relative bg-gray-100">
//       <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
//         <div className="text-center lg:text-left">
//           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
//             Step into Style, <br className="hidden lg:block" />
//             Redefine Your Wardrobe
//           </h1>
//           <p className="mt-4 text-gray-600 text-lg">
//             Discover the latest trends in fashion and enjoy exclusive deals on
//             premium clothing.
//           </p>
//           <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//             <Button
//               size="lg"
//               className="bg-pink-600 hover:bg-pink-700 text-white"
//               onClick={() => navigate("/shop")}
//             >
//               Shop Now
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-gray-300 text-gray-700 hover:text-gray-900"
//               onClick={() => navigate("/about")}
//             >
//               Learn More
//             </Button>
//           </div>
//         </div>

//         <div className="flex justify-center lg:justify-end">
//           <Carousel
//             className="w-full sm:max-w-xl max-w-md rounded-lg shadow-lg"
//             plugins={[
//               Autoplay({
//                 delay: 4000,
//               }),
//             ]}
//             opts={{
//               loop: true,
//             }}
//           >
//             <CarouselContent>
//               <CarouselItem>
//                 <img
//                   loading="eager"
//                   src="/hero-section-1.webp"
//                   alt="Stylish clothing 1"
//                   className="w-full rounded-lg"
//                 />
//               </CarouselItem>
//               <CarouselItem>
//                 <img
//                   src="/hero-section-2.webp"
//                   alt="Stylish clothing 2"
//                   className="w-full rounded-lg"
//                 />
//               </CarouselItem>
//               <CarouselItem>
//                 <img
//                   src="/hero-section-3.webp"
//                   alt="Stylish clothing 3"
//                   className="w-full rounded-lg"
//                 />
//               </CarouselItem>
//               <CarouselItem>
//                 <img
//                   src="/hero-section-4.webp"
//                   alt="Stylish clothing 3"
//                   className="w-full rounded-lg"
//                 />
//               </CarouselItem>
//               <CarouselItem>
//                 <img
//                   src="/hero-section-5.webp"
//                   alt="Stylish clothing 3"
//                   className="w-full rounded-lg"
//                 />
//               </CarouselItem>
//             </CarouselContent>
//             <CarouselPrevious className="hidden sm:flex" />
//             <CarouselNext className="hidden sm:flex" />
//           </Carousel>
//         </div>
//       </div>

//       <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 to-white"></div>
//     </section>
//   );
// }
