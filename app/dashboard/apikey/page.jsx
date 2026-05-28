"use client";

import { useState } from "react";
import CreateApiKeyPopup from "./../../components/apiKey/CreateApiKeyPopup";
import UserApiKeys from "../../components/apiKey/UserApiKeys";

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setPopupOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-8 text-white">
      <div className="w-full max-w-4xl p-8 bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Your API Keys
            </h1>
            <p className="text-gray-300 mt-1 text-sm md:text-base">
              Manage your API keys and create new ones when needed
            </p>
          </div>

          <button
            onClick={() => setPopupOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
          >
            New Key
          </button>
        </div>

        <hr className="border-gray-700" />

        {/* LIST */}
        <div className="flex flex-col gap-3">
          <UserApiKeys key={refreshKey} />
        </div>

      </div>

      <CreateApiKeyPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
