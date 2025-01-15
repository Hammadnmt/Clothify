import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router";

export default function MinimalistProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <Card
      className="w-full max-w-sm mx-auto transition-shadow duration-300 
                 hover:shadow-lg overflow-hidden group rounded-none"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-80 object-cover transition-transform 
                     duration-500 group-hover:scale-105"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/70 
                           hover:bg-white/90 rounded-full p-2"
              >
                <Heart className="text-gray-600 hover:text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Favorites</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3
              className="text-lg font-semibold text-gray-900 
                           line-clamp-1 hover:text-primary"
            >
              {product.name}
            </h3>
            <div className="flex gap-2">
              <Badge variant="outline">{product.category?.name}</Badge>
              <Badge variant="secondary">{product.subCategory?.name}</Badge>
            </div>
          </div>
          <span className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${
                  star <= Math.round(product.ratings)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-xs text-gray-500 ml-2">
              ({product.ratings.toFixed(1)})
            </span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ShoppingCart className="text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to Cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
