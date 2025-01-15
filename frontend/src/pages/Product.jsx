import { useParams } from "react-router";
import TrendingProducts from "@/components/TrendingProducts";
import ProductDetails from "@/components/ProductDetails";
import Reviews from "@/components/Reviews";
import ReviewInput from "@/components/ReviewInput";

export default function Product() {
  const { id } = useParams();

  return (
    <>
      <ProductDetails id={id} />
      <hr className="mb-10" />
      <ReviewInput id={id} />
      <Reviews id={id} />
      <hr className="my-10" />
      <TrendingProducts />
    </>
  );
}
