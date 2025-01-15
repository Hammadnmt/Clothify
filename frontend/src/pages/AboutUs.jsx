import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ShoppingBagIcon, SparklesIcon } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function AboutUs() {
  const [showMore, setShowMore] = useState(false);

  const handleLearnMore = () => {
    setShowMore(true);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen py-10">
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          About <span className="text-pink-600">Clothify</span>
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12">
          At Clothify, we redefine fashion by combining style, comfort, and
          sustainability. Explore the essence of modern clothing tailored to
          perfection.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
            <CheckCircleIcon className="text-pink-600 w-12 h-12 mx-auto mb-4 animate-bounce hover:animate-none" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Quality Craftsmanship
            </h3>
            <p className="text-gray-600">
              Every product is crafted with precision and a commitment to
              excellence.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
            <ShoppingBagIcon className="text-pink-600 w-12 h-12 mx-auto mb-4 animate-bounce hover:animate-none" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Customer First
            </h3>
            <p className="text-gray-600">
              Your satisfaction is our top priority, with a seamless shopping
              experience.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
            <SparklesIcon className="text-pink-600 w-12 h-12 mx-auto mb-4 animate-bounce hover:animate-none" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Sustainable Fashion
            </h3>
            <p className="text-gray-600">
              We are committed to creating fashion that respects the planet.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center place-items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h3>
            <p className="text-gray-600 mb-6">
              Founded with a vision to make high-quality, stylish clothing
              accessible to everyone, Clothify has grown into a brand loved by
              fashion enthusiasts worldwide. Our journey started with a passion
              for design and a promise of integrity. From the very beginning, we
              aimed to bridge the gap between luxury and affordability, ensuring
              that everyone can experience the joy of well-crafted fashion.
            </p>

            {showMore && (
              <>
                <p className="text-gray-600 mb-6">
                  At Clothify, every piece tells a story — of creativity,
                  innovation, and attention to detail. We collaborate with
                  talented designers and ethical manufacturers to bring our
                  customers collections that resonate with their unique sense of
                  style. Whether you're looking for timeless classics or the
                  latest trends, our designs are made to celebrate individuality
                  and inspire confidence.
                </p>
                <p className="text-gray-600 mb-6">
                  Beyond fashion, Clothify is a community. We believe in
                  empowering our customers through choices that align with their
                  values. That’s why we’re deeply committed to sustainability
                  and inclusivity, making sure our clothing reflects not just
                  style but also a positive impact on the world. Join us on this
                  journey as we continue to redefine the future of fashion, one
                  outfit at a time.
                </p>
              </>
            )}

            {!showMore && (
              <Button
                onClick={handleLearnMore}
                className="bg-pink-600 hover:bg-pink-700 text-white mt-4"
              >
                Learn More
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <img
              src="/about-img-1.webp"
              alt="About Clothify"
              className="rounded-lg shadow-lg w-1/2"
            />
            <div className="space-y-3">
              <img
                src="/about-img-2.webp"
                alt="About Clothify"
                className="rounded-lg shadow-lg w-1/2"
              />
              <img
                src="/about-img-3.webp"
                alt="About Clothify"
                className="rounded-lg shadow-lg w-1/2"
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Clothify?</AccordionTrigger>
              <AccordionContent>
                Clothify is your ultimate destination for stylish, sustainable,
                and high-quality clothing, designed to fit every occasion and
                personality.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                We offer a hassle-free return policy within 30 days of purchase.
                Items must be in their original condition with tags attached.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Do you offer international shipping?
              </AccordionTrigger>
              <AccordionContent>
                Yes, we ship worldwide! Shipping times and costs may vary
                depending on your location.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                How do you ensure sustainability?
              </AccordionTrigger>
              <AccordionContent>
                We source eco-friendly materials and partner with ethical
                manufacturers to reduce our environmental footprint.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
