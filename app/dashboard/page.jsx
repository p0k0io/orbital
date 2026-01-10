"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";

import EndpointList from "../components/endpoint/EndpointList";
import EndpointDetails from "../components/endpoint/EndpointDetails";
import CreateEndPopup from "../components/endpoint/CreateEndPopup";
import DashboardCharts from "../components/charts/DashboardCharts";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [selectedCard, setSelectedCard] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelect = (endpoint) => setSelectedCard(endpoint);
  const handleClose = () => setSelectedCard(null);
  const openCreateModal = () => setPopupOpen(true);

  const fetchEndpoints = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/get/endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setEndpoints(data.endpoints || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error fetching endpoints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) fetchEndpoints();
  }, [isLoaded, user]);

  return (
    <div className="w-full h-auto p-5 flex flex-col">
      {/* Contenedor principal de lista + detalles */}
      <div className="flex flex-row gap-3 flex-1 overflow-hidden pl-28">
        {/* LISTA */}
        <motion.div
          className="w-[380px] flex-shrink-0 h-full overflow-y-auto"
          animate={{ x: selectedCard ? -80 : 340 }}
          transition={{ type: "spring", stiffness: 250, damping: 30 }}
        >
          <EndpointList
            endpoints={endpoints}
            loading={loading}
            errorMsg={errorMsg}
            handleSelect={handleSelect}
            openCreateModal={openCreateModal}
            selectedCard={selectedCard}
          />
        </motion.div>

        {/* DETALLES */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              className="flex-1 h-full overflow-y-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
            >
              <EndpointDetails
                selectedCard={selectedCard}
                handleClose={handleClose}
                refresh={fetchEndpoints}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PANEL INFERIOR ESTADÍSTICAS */}
      <div className="w-full mt-8 h-auto  bg-white/5 border border-white/10 rounded-xl p-4 overflow-y-auto">
        {user && <DashboardCharts userId={user.id} />}
      </div>

      {/* POPUP */}
      <CreateEndPopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          fetchEndpoints();
        }}
      />
    </div>
  );
}
