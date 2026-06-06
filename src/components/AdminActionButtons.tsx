"use client";

import { useState } from "react";
import RejectModal from "./RejectModal";
import { CheckCircle, Trash2 } from "lucide-react";

export default function AdminActionButtons({ productId, onSuccess }: { productId: number; onSuccess?: (id: number) => void }) {
  const [loading, setLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess(productId);
      } else {
        alert("Error approving product: " + data.error);
      }
    } catch (err: any) {
      alert("System error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <button 
          onClick={() => setRejectModalOpen(true)}
          disabled={loading}
          title="Reject"
          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer border border-rose-500/20 disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button 
          onClick={handleApprove}
          disabled={loading}
          title="Approve & Publish"
          className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer border border-emerald-500/20 disabled:opacity-50"
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>

      {rejectModalOpen && (
        <RejectModal 
          productId={productId} 
          onClose={() => setRejectModalOpen(false)} 
          onSuccess={() => {
            setRejectModalOpen(false);
            if (onSuccess) onSuccess(productId);
          }}
        />
      )}
    </>
  );
}
