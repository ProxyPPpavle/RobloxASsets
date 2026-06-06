"use client";

import { useState } from "react";

export default function EditProfileModal({ 
  currentUsername, 
  onClose 
}: { 
  currentUsername: string,
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.error || "Update error.");
      }
    } catch (err: any) {
      setMessage("System error: " + err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0b0f1a]/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">
        <div className="flex justify-between items-center p-6 border-b border-[#30363d] bg-[#0d1117]">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm text-[#8b949e] font-bold mb-1">Username</label>
            <input 
              type="text" 
              name="username" 
              defaultValue={currentUsername}
              className="w-full p-3 bg-[#0d1117] text-white border border-[#30363d] rounded-lg focus:outline-none focus:border-[#58a6ff] transition-colors" 
            />
          </div>

          <div>
            <label className="block text-sm text-[#8b949e] font-bold mb-1">Avatar Image (Optional)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#30363d] border-dashed rounded-lg cursor-pointer bg-[#0d1117] hover:bg-[#161b22] hover:border-[#58a6ff] transition-all group overflow-hidden relative">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {avatarFile ? (
                  <span className="text-[#58a6ff] font-medium">{avatarFile.name}</span>
                ) : (
                  <>
                    <svg className="w-8 h-8 mb-3 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="mb-2 text-sm text-[#8b949e]"><span className="font-semibold text-[#58a6ff]">Click to upload</span> new avatar</p>
                  </>
                )}
              </div>
              <input type="file" name="avatar" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm font-bold ${message.includes("success") ? "bg-[#2ea043]/20 text-[#3fb950] border border-[#2ea043]/30" : "bg-[#da3633]/20 text-[#ff7b72] border border-[#da3633]/30"}`}>
              {message}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-bold text-[#8b949e] hover:bg-[#21262d] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg font-bold bg-[#58a6ff] hover:bg-[#3182ce] text-white disabled:opacity-50 transition-colors shadow-lg">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
