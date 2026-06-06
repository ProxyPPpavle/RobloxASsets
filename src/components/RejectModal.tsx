"use client";

import { useState } from "react";

export default function RejectModal({ productId, onClose, onSuccess }: { productId: number; onClose: () => void; onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleReject = async () => {
    if (!reason) return alert("Please select a reason for rejection.");
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, reason }),
      });
      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess();
      } else {
        alert("Error rejecting product: " + data.error);
      }
    } catch (err: any) {
      alert("System error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0b0f1a]/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-[#161b22] border border-[#da3633]/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-[#30363d]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-[#da3633]">⚠️</span> Reject Asset
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#8b949e]">
            Select the reason for rejecting this asset. A notification will be sent to the creator automatically.
          </p>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-[#30363d] rounded-lg cursor-pointer hover:bg-[#21262d] transition-colors">
              <input type="radio" name="reason" value="Inappropriate content" onChange={(e) => setReason(e.target.value)} className="text-[#da3633]" />
              <span className="text-sm font-bold text-white">Inappropriate content</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-[#30363d] rounded-lg cursor-pointer hover:bg-[#21262d] transition-colors">
              <input type="radio" name="reason" value="File and image don't match" onChange={(e) => setReason(e.target.value)} className="text-[#da3633]" />
              <span className="text-sm font-bold text-white">File and image don't match</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-[#30363d] rounded-lg cursor-pointer hover:bg-[#21262d] transition-colors">
              <input type="radio" name="reason" value="Suspicious content" onChange={(e) => setReason(e.target.value)} className="text-[#da3633]" />
              <span className="text-sm font-bold text-white">Suspicious content</span>
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-[#30363d] flex justify-end gap-3 bg-[#0d1117]">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-bold text-[#8b949e] hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={handleReject} disabled={loading || !reason} className="px-6 py-2 rounded-lg font-bold bg-[#da3633] text-white hover:bg-[#b02a28] disabled:opacity-50 transition-colors shadow-lg">
            {loading ? "Rejecting..." : "Confirm Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
