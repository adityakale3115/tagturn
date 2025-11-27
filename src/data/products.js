// src/data/products.js

const products = [
  {
    id: 1,
    name: "Elegance Diamond Drop Earrings",
    price: 185000,
    stock: 5,
    seller: "Kalliski Store",
    category: "Jewellery",
    sizes: null, // no sizes for jewellery
    images: [
      "/images/jewel-1-1.jpg",
      "/images/jewel-1-2.jpg",
      "/images/jewel-1-3.jpg"
    ],
    shortDesc: "Premium luxury earrings crafted with precision.",
    description:
      "These elegance diamond drop earrings are crafted with lab-grown diamonds and hallmarked gold. Perfect for occasions and daily wear with a timeless design."
  },
  {
    id: 2,
    name: "Classic Gold Chain",
    price: 90000,
    stock: 10,
    seller: "GoldPlus Shop",
    category: "Jewellery",
    sizes: null,
    images: [
      "/images/chain-1-1.jpg",
      "/images/chain-1-2.jpg"
    ],
    shortDesc: "Elegant gold chain with premium finishing.",
    description:
      "A classic gold chain designed to match all outfits. Lightweight, durable and BIS hallmarked."
  },
  {
    id: 3,
    name: "Black Oversized Hoodie",
    price: 1500,
    stock: 15,
    seller: "UrbanFit Store",
    category: "Hoodie",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/images/hoodie-black-1.jpg",
      "/images/hoodie-black-2.jpg",
      "/images/hoodie-black-3.jpg"
    ],
    shortDesc: "Premium oversized hoodie for winters.",
    description:
      "Soft fleece fabric with relaxed fit and dropped shoulders. Perfect for streetwear look and everyday comfort."
  },
  {
    id: 4,
    name: "Beige Basic Hoodie",
    price: 1499,
    stock: 7,
    seller: "UrbanFit Store",
    category: "Hoodie",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/images/hoodie-beige-1.jpg",
      "/images/hoodie-beige-2.jpg"
    ],
    shortDesc: "Warm beige hoodie with clean minimal design.",
    description:
      "Soft brushed inside, ribbed cuffs and hem. A clean minimal hoodie for everyday wear."
  }
];

export default products;
