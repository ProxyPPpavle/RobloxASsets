"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function DeleteNotificationButton({
  notifId,
  onDeleted,
}: {
  notifId: string | number;
  onDeleted?: (id: string | number) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleted?.(notifId);
    setLoading(true);

    try {
      const res = await fetch(`/api/notifications/${notifId}/delete`, { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        window.location.reload();
      }
    } catch {
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
      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50 cursor-pointer"
      title="Dismiss message (does not delete asset files)"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
