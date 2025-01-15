import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useNavigate } from "react-router";
import { formatPrice } from "@/utils/helper";
import { Badge } from "./ui/badge";

export default function FavoritesSection({ favorites, onRemove }) {
  const navigate = useNavigate();
  return (
    <Card className="p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Heart className="mr-2 fill-red-600 stroke-red-600" size={28} /> Your
        Favorites
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((item) => (
          <Card key={item._id} className="p-4">
            <div className="flex gap-4">
              <img
                src={item.productId.images[0]}
                alt={item.productId.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold line-clamp-1">
                  {item.productId.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.productId.price)}
                  </p>
                  {item.productId.isOnSale && (
                    <Badge className={"bg-red-700"}>Sale</Badge>
                  )}
                </div>
                <div className="flex gap-1 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/product/${item.productId._id}`)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="underline text-red-600 text-xs"
                    size="sm"
                    onClick={() => onRemove(item.productId._id)}
                  >
                    remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
