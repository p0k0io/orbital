// lib/prices.ts

export type PriceConfig = {
  priceId: string;
  productId: string;
  tier: "free" | "starter" | "production" | "enterprise";
  credits: number;
  amountEUR: number;
};

export const PRICES: Record<string, PriceConfig> = {
  // 🔵 ENTERPRISE
  price_1SkD3XCAyOauno7dKHrbCwP4: {
    priceId: "price_1SkD3XCAyOauno7dKHrbCwP4",
    productId: "prod_ThcHKuqkWJqWJc",
    tier: "enterprise",
    credits: 10_000_000,
    amountEUR: 12.99,
  },
  price_1SkD38CAyOauno7drZyQxvG1: {
    priceId: "price_1SkD38CAyOauno7drZyQxvG1",
    productId: "prod_ThcHKuqkWJqWJc",
    tier: "enterprise",
    credits: 5_000_000,
    amountEUR: 4.99,
  },
  price_1SkD2ZCAyOauno7dOuLMqoVv: {
    priceId: "price_1SkD2ZCAyOauno7dOuLMqoVv",
    productId: "prod_ThcHKuqkWJqWJc",
    tier: "enterprise",
    credits: 1_000_000,
    amountEUR: 1.4,
  },

  // 🟢 PRODUCTION
  price_1SkD1ECAyOauno7d0ufipSZZ: {
    priceId: "price_1SkD1ECAyOauno7d0ufipSZZ",
    productId: "prod_ThcE9Fe7rUaQPE",
    tier: "production",
    credits: 10_000_000,
    amountEUR: 12.99,
  },
  price_1SkD0sCAyOauno7dG2R8FMwy: {
    priceId: "price_1SkD0sCAyOauno7dG2R8FMwy",
    productId: "prod_ThcE9Fe7rUaQPE",
    tier: "production",
    credits: 5_000_000,
    amountEUR: 7.99,
  },
  price_1SkD04CAyOauno7deX8JWguR: {
    priceId: "price_1SkD04CAyOauno7deX8JWguR",
    productId: "prod_ThcE9Fe7rUaQPE",
    tier: "production",
    credits: 1_000_000,
    amountEUR: 2.25,
  },

  // 🟣 STARTER
  price_1SkCvzCAyOauno7dHxq9osvK: {
    priceId: "price_1SkCvzCAyOauno7dHxq9osvK",
    productId: "prod_Thc7ELIk6yxHdF",
    tier: "starter",
    credits: 10_000_000,
    amountEUR: 18.99,
  },
  price_1SkCu2CAyOauno7dlV9zuUI0: {
    priceId: "price_1SkCu2CAyOauno7dlV9zuUI0",
    productId: "prod_Thc7ELIk6yxHdF",
    tier: "starter",
    credits: 5_000_000,
    amountEUR: 10.99,
  },
  price_1SkCtcCAyOauno7dFG02IsD4: {
    priceId: "price_1SkCtcCAyOauno7dFG02IsD4",
    productId: "prod_Thc7ELIk6yxHdF",
    tier: "starter",
    credits: 1_000_000,
    amountEUR: 2.99,
  },

  // ⚪ FREE (paid packs)
  price_1Sj0cXCAyOauno7dw3HAzj42: {
    priceId: "price_1Sj0cXCAyOauno7dw3HAzj42",
    productId: "prod_Tg8ydRsoFfpBG7",
    tier: "free",
    credits: 10_000_000,
    amountEUR: 26.99,
  },
  price_1Sj0WcCAyOauno7d111bhrzy: {
    priceId: "price_1Sj0WcCAyOauno7d111bhrzy",
    productId: "prod_Tg8ydRsoFfpBG7",
    tier: "free",
    credits: 5_000_000,
    amountEUR: 15.99,
  },
  price_1Simg9CAyOauno7dARCkXiMw: {
    priceId: "price_1Simg9CAyOauno7dARCkXiMw",
    productId: "prod_Tg8ydRsoFfpBG7",
    tier: "free",
    credits: 1_000_000,
    amountEUR: 4.5,
  },
};
