"use client";

import { useUser } from "@clerk/nextjs";
import { CREDIT_PRICES } from "../../lib/prices";

export default function PricingPage() {
  const { user } = useUser();

  const pay = async (priceId) => {
    if (!user) {
      alert("You must be logged in");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId,
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (!data.url) {
      alert("Checkout error");
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Buy Credits</h1>

      <div className="grid gap-4">
        {CREDIT_PRICES.map((p) => (
          <div
            key={p.priceId}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{p.pack}</h2>
              <p className="text-sm text-gray-600">{p.description}</p>
            </div>

            <button
              onClick={() => pay(p.priceId)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buy {p.amount}€
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
