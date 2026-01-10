"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { PRICES } from "../../../lib/prices";

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const [userCredits, setUserCredits] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchUserCredits();
    fetchUserPlan();
  }, [isLoaded, user]);

  const fetchUserCredits = async () => {
    try {
      const res = await fetch("/api/get/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) setUserCredits(data.credits);
    } catch (err) {
      console.error("Error fetching credits", err);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const res = await fetch("/api/get/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) setUserPlan(data.plan);
    } catch (err) {
      console.error("Error fetching plan", err);
    }
  };

  const pay = async (priceId) => {
    if (!user) return;
    setLoadingCheckout(priceId);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, userId: user.id }),
    });

    const data = await res.json();
    setLoadingCheckout(null);

    if (!data?.url) {
      alert("Checkout error");
      return;
    }

    window.location.href = data.url;
  };

  if (!isLoaded) return null;

  const documentsRemaining =
    userCredits !== null ? Math.floor(userCredits / 400) : 0;

  const availablePrices = Object.values(PRICES)
    .filter((p) => p.tier === userPlan)
    .sort((a, b) => a.credits - b.credits);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-8 text-white">
      <div className="w-full max-w-4xl p-8 bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Credits & Billing
            </h1>
            <p className="text-gray-300 mt-1 text-sm md:text-base">
              Manage your credits and purchase more when needed
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-gray-700 text-white font-semibold text-sm shadow-sm">
            Plan: <span className="capitalize">{userPlan || "Loading..."}</span>
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* BALANCE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700 shadow-sm flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm">Available credits</p>
            <p className="text-3xl font-bold mt-1">{userCredits?.toLocaleString() ?? "—"}</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-800 border border-gray-700 shadow-sm flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm">Documents remaining</p>
            <p className="text-3xl font-bold mt-1">{documentsRemaining.toLocaleString()}</p>
          </div>
        </div>

        {/* BUY MORE */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Buy More Credits</h2>

          {availablePrices.length === 0 ? (
            <p className="text-gray-400">No credit packs available for your plan.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {availablePrices.map((p, idx) => (
                <div
                  key={p.priceId}
                  className={`p-6 rounded-2xl border border-gray-700 shadow-md transform hover:-translate-y-1 transition-all duration-300
                    ${idx === availablePrices.length - 1 ? "border-blue-500" : "bg-gray-800/50"}`}
                >
                  <p className="text-lg font-semibold text-white">{p.credits / 1_000_000}M Credits</p>
                  <p className="text-gray-400 text-xs mt-1">
                    ≈ {(p.credits / 400).toLocaleString()} documents
                  </p>
                  <p className="text-blue-400 font-bold text-xl mt-3">{p.amountEUR}€</p>
                  <button
                    onClick={() => pay(p.priceId)}
                    disabled={loadingCheckout === p.priceId}
                    className="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50"
                  >
                    {loadingCheckout === p.priceId ? "Redirecting..." : "Buy"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
