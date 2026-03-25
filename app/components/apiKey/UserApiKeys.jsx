"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FiTrash2 } from "react-icons/fi";
import { createPortal } from "react-dom";
import ConfirmActionModal from "../ConfirmActionModal";
import ToastNotification from "../ToastNotification";

export default function UserApiKeys() {
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchKeys = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/get/api-keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await res.json();

        if (res.ok) setKeys(data.keys);
        else console.error(data.error);
      } catch (err) {
        console.error("Error fetching API keys:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, [user]);

  const openDeleteModal = (key) => {
    setSelectedKey(key);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedKey) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/delete/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName: selectedKey.id_key }),
      });

      const data = await res.json();

      if (res.ok) {
        setKeys((prev) =>
          prev.filter((k) => k.id_key !== selectedKey.id_key)
        );
        setToast({
          type: "success",
          text: "Operación realizada correctamente",
        });

        
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error deleting key:", err);
    } finally {
      setDeleting(false);
      setModalOpen(false);
      setSelectedKey(null);
    }
  };

  if (loading) return <p className="text-white/70">Cargando API keys...</p>;

  if (!keys || keys.length === 0)
    return <p className="text-white/70">No tienes API keys aún.</p>;

  return (
    <>
      <div className="w-full max-w-3xl flex flex-col gap-3">
        {keys.map((k, idx) => (
          <div
            key={`${k.name}-${k.created_at}-${idx}`}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 flex items-center justify-between shadow-md hover:bg-white/20 transition-all"
          >
            {/* Nombre */}
            <div className="flex flex-col w-1/3 truncate">
              <span className="text-white font-semibold truncate">
                {k.name}
              </span>
              <span className="text-white/50 text-xs truncate">
                {k.pre}...
              </span>
            </div>

            {/* Fecha */}
            <span className="text-white/50 text-xs w-1/3 text-right">
              {new Date(k.created_at).toLocaleDateString()}
            </span>

            {/* Botón eliminar */}
            <button
              onClick={() => openDeleteModal(k)}
              className="ml-4 flex items-center justify-center w-8 h-8 bg-red-500 rounded-md hover:bg-red-600 transition"
              title="Eliminar API Key"
            >
              <FiTrash2 size={16} className="text-white" />
            </button>
          </div>
        ))}
      </div>

      {/* PORTAL MODALS */}
      {mounted &&
        createPortal(
          <>
            <ConfirmActionModal
              open={modalOpen}
              message={`¿Seguro que quieres eliminar la API Key "${selectedKey?.name}"? Esta acción no se puede deshacer.`}
              onConfirm={handleDelete}
              onCancel={() => setModalOpen(false)}
              loading={deleting}
            />

            {toast && (
              <ToastNotification
                type={toast.type}
                text={toast.text}
                onClose={() => setToast(null)}
              />
            )}
          </>,
          document.body
        )}
    </>
  );
}