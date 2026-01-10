// lib/products.ts

export type ProductTier =
  | "free"
  | "starter"
  | "production"
  | "enterprise";

export const PRODUCTS = {
  free: {
    productId: "prod_Tg8ydRsoFfpBG7",
    name: "Free Tier",
  },
  starter: {
    productId: "prod_Thc7ELIk6yxHdF",
    name: "Starter Tier",
  },
  production: {
    productId: "prod_ThcE9Fe7rUaQPE",
    name: "Production Tier",
  },
  enterprise: {
    productId: "prod_ThcHKuqkWJqWJc",
    name: "Enterprise Tier",
  },
} as const;
