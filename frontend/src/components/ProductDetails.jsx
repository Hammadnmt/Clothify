import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSelector } from "react-redux";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetProductQuery } from "@/services/productsApi";
import AddToCart from "./AddToCart";
import { useVariantSelector } from "@/hooks/useVariantSelector";
import Rating from "./Ratings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import ImageLightBox from "./ImageLightBox";

export default function ProductDetails({ id }) {
  const [openLightBox, setOpenLightBox] = useState(false);
  const [lightBoxIndex, setLightBoxIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { data: { product } = {}, isLoading, isError } = useGetProductQuery(id);

  const cartItem = cartItems.find((item) => item?._id === product?._id) || null;

  const {
    selectedColor,
    selectedSize,
    selectedVariant,
    availableColors,
    availableSizes,
    handleColorChange,
    handleSizeChange,
  } = useVariantSelector(product, cartItem);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">
          Failed to load product data. Please try again later.
        </p>
      </div>
    );
  }

  const handleImageClick = (index, e) => {
    e.stopPropagation();
    setLightBoxIndex(index);
    setOpenLightBox(true);
  };

  const isProductPage = location.pathname === `/product/${id}`;

  const handleBuyNow = () => {
    const selectedSizeObj = selectedVariant?.sizes.find(
      (s) => s.size === selectedSize
    );
    if (!selectedVariant || !selectedSizeObj?.stock) return;
    navigate("/checkout");
  };

  const selectedSizeObj = selectedVariant?.sizes.find(
    (s) => s.size === selectedSize
  );
  const stock = selectedSizeObj?.stock || 0;

  return (
    <>
      <div className="bg-gray-50 py-8 px-4 overflow-y-auto">
        <div className="container mx-auto max-w-6xl">
          {isProductPage && (
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}

          <Card className="bg-white shadow-md">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-[400px] md:h-[600px] w-full bg-gray-50 rounded-s-lg overflow-hidden">
                {product.images && (
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {product.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div
                            className="h-[400px] md:h-[600px] w-full relative cursor-pointer"
                            onClick={(e) => handleImageClick(index, e)}
                          >
                            <img
                              src={image}
                              alt={`${product.name} - View ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {product.images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                )}
              </div>

              <div className="flex flex-col space-y-6 p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    <Badge variant="secondary" className="capitalize">
                      {product.gender}
                    </Badge>
                  </div>
                  <Rating
                    average={product.ratings.average}
                    count={product.ratings.count}
                    starSize="h-3.5 w-3.5"
                    className="mb-2"
                  />
                  {product.price.sale ? (
                    <div>
                      <div className="text-base font-semibold line-through text-gray-500">
                        ${product.price.base.toFixed(2)}
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        ${product.price.sale.toFixed(2)}
                        <span className="text-sm text-green-500 ml-4 font-medium">
                          {product.discountPercentage}% off
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-gray-900">
                      ${product.price.base.toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Color
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <Badge
                          key={color}
                          variant={
                            selectedColor === color ? "default" : "outline"
                          }
                          className="cursor-pointer px-4 py-2"
                          onClick={() => handleColorChange(color)}
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Size
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <Badge
                          key={size}
                          variant={
                            selectedSize === size ? "default" : "outline"
                          }
                          className="cursor-pointer px-4 py-2"
                          onClick={() => handleSizeChange(size)}
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    {product.materials && product.materials.length > 0 && (
                      <p>
                        <span className="font-medium">Material: </span>
                        {product.materials.join(", ")}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Stock: </span>
                      {stock > 0 ? (
                        <span className={stock < 10 ? "text-red-500" : ""}>
                          {stock} available
                        </span>
                      ) : (
                        <span className="text-red-500">Out of stock</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Seasonality: </span>
                      {product.seasonality}
                    </p>
                    {product.tags && product.tags.length > 0 && (
                      <p>
                        <span className="font-medium">Tags: </span>
                        {product.tags.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {isProductPage && (
                  <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8">
                    {cartItem && (
                      <Button
                        size="lg"
                        className="flex-1 py-4 bg-pink-600 hover:bg-pink-700 text-white"
                        variant="default"
                        disabled={!selectedVariant || stock === 0}
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                    )}

                    <AddToCart
                      size="lg"
                      className="flex-1 py-4"
                      variant="secondary"
                      disabled={!selectedVariant || stock === 0}
                      item={{
                        ...product,
                        selectedVariant,
                        selectedColor,
                        selectedSize,
                      }}
                    >
                      Add to Cart
                    </AddToCart>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 px-6">
                <hr />

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="description">
                    <AccordionTrigger className="text-lg font-semibold">
                      Description
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 prose max-w-none">
                      {product.description}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="specifications">
                    <AccordionTrigger className="text-lg font-semibold">
                      Specifications
                    </AccordionTrigger>
                    <AccordionContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        {product.materials && product.materials.length > 0 && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Materials
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {product.materials.join(", ")}
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Gender
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {product.gender}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Seasonality
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {product.seasonality}
                          </dd>
                        </div>
                        {product.tags && product.tags.length > 0 && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Tags
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {product.tags.join(", ")}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <ImageLightBox
        open={openLightBox}
        setOpen={setOpenLightBox}
        slides={product.images.map((image) => ({ src: image })) || []}
        initialIndex={lightBoxIndex}
      />
    </>
  );
}
