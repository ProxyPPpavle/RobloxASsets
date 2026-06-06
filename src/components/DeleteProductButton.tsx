"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({
  productId,
  onDeleted,
}: {
  productId: string | number;
  onDeleted?: (id: string | number) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this asset permanently? Storage files will be removed.")) return;

    onDeleted?.(productId);
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}/delete`, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) {
        alert("Failed to delete: " + (data.error || "Unknown error"));
        window.location.reload();
        return;
      }
      if (data.storageWarning) {
        console.warn("Storage:", data.storageWarning);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error";
      alert(message);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer border border-rose-500/25 disabled:opacity-50"
      title="Delete asset"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
