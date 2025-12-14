function scrapeSampleProduct(productName) {
  return [
    {
      site: "Amazon",
      price: 52999,
      product: productName
    },
    {
      site: "Flipkart",
      price: 54999,
      product: productName
    }
  ];
}

module.exports = { scrapeSampleProduct };
