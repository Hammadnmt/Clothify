export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.sale || price.base);
};

export const calculateGrandTotal = (items) => {
  const baseTotalPrice = items.reduce(
    (acc, item) => acc + item.price.base * item.quantity,
    0
  );

  const saleTotalPrice = items.reduce(
    (acc, item) => acc + (item.price.sale ?? item.price.base) * item.quantity,
    0
  );

  const discountPercentage =
    baseTotalPrice === 0
      ? 0
      : Math.round((1 - saleTotalPrice / baseTotalPrice) * 100);

  const finalPrice = saleTotalPrice;

  const grandTotal = {
    baseTotal: baseTotalPrice.toFixed(2),
    saleTotal: saleTotalPrice.toFixed(2),
    discountPercentage,
    finalPrice: finalPrice.toFixed(2),
  };

  return grandTotal;
};
