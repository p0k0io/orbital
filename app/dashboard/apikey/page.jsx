"use client";

import { useState } from "react";
import CreateApiKeyPopup from "./../../components/apiKey/CreateApiKeyPopup";
import UserApiKeys from "../../components/apiKey/UserApiKeys";

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-3xl p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Your API Keys</h1>
          <button
            onClick={() => setPopupOpen(true)}
            className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white font-medium hover:bg-white/30 transition"
          >
            New Key
          </button>
        </div>
        <hr />

        {/* Lista de API Keys futura */}
        <div className="flex flex-col gap-2">
          {/* Mapear keys existentes */}
          <UserApiKeys />
        </div>
      </div>

      <CreateApiKeyPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </div>
  );
}
