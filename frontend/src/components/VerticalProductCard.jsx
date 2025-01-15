import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import AddToCart from "./AddToCart";
import Rating from "./Ratings";
import { useVariantSelector } from "@/hooks/useVariantSelector";
import { useSelector } from "react-redux";

export default function VerticalProductCard({
  product,
  onClick,
  handleFav,
  isLoading = false,
  isFavorite = false,
}) {
  const cartItems = useSelector((state) => state.cart.cartItems);
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

  if (!selectedVariant) return null;

  const selectedSizeObj = selectedVariant.sizes.find(
    (s) => s.size === selectedSize
  );
  const stock = selectedSizeObj?.stock || 0;

  return (
    <Card
      className="group w-full max-w-2xl mx-auto overflow-hidden"
      onClick={(e) => {
        e.stopPropagation();
        onClick(product._id);
      }}
    >
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative h-[400px] w-full">
            <div className="h-[400px] w-full relative">
              <img
                src={product.images[0]}
                alt={`${product.name}`}
                className="w-full h-full object-cover"
              />
            </div>

            <Button
              disabled={isLoading}
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={(e) => handleFav(e, product._id)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite && "fill-red-600 stroke-red-600"
                }`}
              />
            </Button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-xl leading-tight line-clamp-1">
                  {product.name}
                </h2>
                <Badge variant="secondary" className="capitalize line-clamp-1">
                  {product.gender}
                </Badge>
              </div>

              <Rating
                average={product.ratings.average}
                count={product.ratings.count}
                starSize="h-3.5 w-3.5"
                className="mb-4"
              />

              <div className="text-2xl font-bold">
                {product.price.sale ? (
                  <div>
                    <span className="line-through text-gray-500 text-lg mr-2">
                      ${product.price.base.toFixed(2)}
                    </span>
                    <span>${product.price.sale.toFixed(2)}</span>
                  </div>
                ) : (
                  <span>${product.price.base.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <Badge
                      key={size}
                      variant={size === selectedSize ? "solid" : "outline"}
                      className={`cursor-pointer ${
                        size === selectedSize
                          ? "bg-gray-300"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSizeChange(size);
                      }}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <Badge
                      key={color}
                      variant={color === selectedColor ? "solid" : "outline"}
                      className={`cursor-pointer ${
                        color === selectedColor
                          ? "bg-gray-300"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorChange(color);
                      }}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-500 space-y-1">
                {product.materials && product.materials.length > 0 && (
                  <p className="line-clamp-1">
                    <span className="font-medium">Material:</span>{" "}
                    {product.materials.join(", ")}
                  </p>
                )}
                <p className="line-clamp-1">
                  <span className="font-medium">Stock:</span> {stock} available
                </p>
                <p className="line-clamp-1">
                  <span className="font-medium">Season:</span>{" "}
                  {product.seasonality}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <p className="line-clamp-1">
                    <span className="font-medium">Tags:</span>{" "}
                    {product.tags.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <AddToCart
              className="w-full"
              disabled={!selectedVariant || stock === 0}
              item={{
                ...product,
                selectedVariant,
                selectedColor,
                selectedSize,
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </AddToCart>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
