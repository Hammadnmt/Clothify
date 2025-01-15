import { useState, useEffect } from "react";

export function useVariantSelector(product, cartItem) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (cartItem) {
      setSelectedColor(cartItem.selectedColor);
      setSelectedSize(cartItem.selectedSize);
      setSelectedVariant(
        product?.variants.find((v) => v.color === cartItem.selectedColor)
      );
    } else if (product?.variants?.length > 0) {
      const firstVariant = product.variants[0];
      const firstSize = firstVariant.sizes[0]?.size;
      setSelectedColor(firstVariant.color);
      setSelectedSize(firstSize);
      setSelectedVariant(firstVariant);
    }
  }, [product, cartItem]);

  const getAvailableSizes = (color) => {
    const variant = product?.variants.find((v) => v.color === color);
    return variant?.sizes.map((s) => s.size) || [];
  };

  const getVariant = (color) => {
    return product?.variants.find((v) => v.color === color);
  };

  const handleColorChange = (color) => {
    const variant = getVariant(color);
    setSelectedColor(color);
    setSelectedVariant(variant);

    const sizes = variant?.sizes || [];
    const firstAvailableSize =
      sizes.find((s) => s.stock > 0)?.size || sizes[0]?.size;
    setSelectedSize(firstAvailableSize);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const availableColors = product?.variants.map((v) => v.color) || [];
  const availableSizes = selectedColor ? getAvailableSizes(selectedColor) : [];

  return {
    selectedColor,
    selectedSize,
    selectedVariant,
    availableColors: [...new Set(availableColors)],
    availableSizes,
    handleColorChange,
    handleSizeChange,
  };
}
