"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, Save, FileCode, Sliders, Info, UploadCloud, HelpCircle, Loader2, CheckCircle2 } from "lucide-react";
import CardStudio from "./CardStudio";
import { CardStyles } from "../types";

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");
  
  const [activeTab, setActiveTab] = useState<"info" | "design">("info");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [robloxLink, setRobloxLink] = useState("");
  const [isFree, setIsFree] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ thumbnail: 0, file: 0 });
  const [category, setCategory] = useState("Model");

  const [cardStyles, setCardStyles] = useState<CardStyles>({
    bgColor: '#13192b',
    bgImage: '',
    textColor: '#FFFFFF',
    fontFamily: 'font-sans',
    frameStyle: 'none',
    gridEnabled: false,
    titleColor: '#FFFFFF',
    descriptionColor: '#94A3B8',
    titleFont: 'font-sans',
    descriptionFont: 'font-sans',
    borderColor: '#3b82f6',
    borderWidth: 1.5
  });

  const handleChangeStyles = (updated: Partial<CardStyles>) => {
    setCardStyles(prev => ({ ...prev, ...updated }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setUploadProgress(prev => ({ ...prev, thumbnail: 100 }));
    }
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setValidationError("Roblox model size exceeds 25 MB.");
        setAssetFile(null);
        return;
      }
      setValidationError("");
      setAssetFile(file);
      setUploadProgress(prev => ({ ...prev, file: 100 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError("Please enter a Roblox asset title.");
      setActiveTab("info");
      return;
    }
    if (!isFree && !robloxLink.trim()) {
      setValidationError("Please specify a Roblox Gamepass or Developer Product URL for cash-out routing.");
      setActiveTab("info");
      return;
    }
    if (!imageFile || !assetFile) {
      setValidationError("Please upload both a thumbnail and the asset file.");
      setActiveTab("info");
      return;
    }

    setValidationError("");
    setLoading(true);
    setIsSuccess(false);

    const messages = ["Publishing...", "Uploading assets...", "Redirecting...", "Polishing..."];
    let step = 0;
    setLoadingMessage(messages[step]);
    const interval = setInterval(() => {
      step = (step + 1) % messages.length;
      setLoadingMessage(messages[step]);
    }, 1200);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isFree", isFree.toString());
    formData.append("robloxLink", robloxLink);
    formData.append("category", category);
    formData.append("styles", JSON.stringify(cardStyles));
    formData.append("image", imageFile);
    formData.append("file", assetFile);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      clearInterval(interval);

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setValidationError(data.error || "Upload error.");
        setLoading(false);
      }
    } catch (err: any) {
      clearInterval(interval);
      setValidationError("System error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div id="upload-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div 
        id="upload-modal-contents"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-4xl bg-[#111625] border border-slate-700/90 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] my-8 text-[#f1f5f9]"
      >
        <div className="p-5 bg-[#090c14] border-b border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-black tracking-tight text-white flex items-center gap-2">
              Upload Package
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-16 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle2 className="w-20 h-20 text-emerald-500" />
            </motion.div>
            <h3 className="text-2xl font-black text-white tracking-tight">Post Uploaded!</h3>
            <p className="text-slate-400 font-mono text-sm">{loadingMessage}</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-center space-y-6">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <h3 className="text-xl font-bold text-white tracking-tight animate-pulse">{loadingMessage}</h3>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex border-b border-slate-800 bg-[#090c14]/40">
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-3 px-4 font-mono text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "info"
                    ? "bg-[#151a2e] border-b-2 border-blue-500 text-white"
                    : "text-slate-500 hover:text-slate-300 hover:bg-[#151a2e]/30"
                }`}
              >
                <Info className="w-4 h-4 text-slate-400" />
                1. Parameters
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("design")}
                className={`flex-1 py-3 px-4 font-mono text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "design"
                    ? "bg-[#151a2e] border-b-2 border-blue-500 text-white"
                    : "text-slate-500 hover:text-slate-300 hover:bg-[#151a2e]/30"
                }`}
              >
                <Sliders className="w-4 h-4 text-slate-400" />
                2. Summary
              </button>
            </div>

        <div id="upload-form-pane" className="p-6">
          {validationError && (
            <div className="mb-4 text-xs font-mono text-rose-450 bg-rose-950/30 border border-rose-550 p-3 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-550" />
              {validationError}
            </div>
          )}

          {activeTab === "info" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#171e31] border border-slate-700/80 p-5 rounded-xl space-y-4 shadow-sm">
                <div className="space-y-1.5 font-sans">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Title</label>
                    <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFree}
                        onChange={(e) => {
                          setIsFree(e.target.checked);
                          if (e.target.checked) setRobloxLink("");
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-700 text-blue-550 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                      />
                      <span className="text-slate-300 font-bold text-[10px] uppercase tracking-wider">Free Asset</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Epic Sword Model"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Description</label>
                  <textarea
                    placeholder="Describe your asset..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Model", "Map", "UI Pack"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                          category === cat
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-[#0a0f1d] border-slate-700 text-slate-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Roblox Gamepass Link
                  </label>
                  <input
                    type="url"
                    disabled={isFree}
                    placeholder={isFree ? "Free assets need no link" : "https://www.roblox.com/gamepass/..."}
                    value={isFree ? "" : robloxLink}
                    onChange={(e) => setRobloxLink(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-600 outline-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                  {!isFree && robloxLink.trim() && (
                    <p className="text-[10px] font-mono text-slate-500">
                      Robux price is verified by admin on approval.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-[#171e31] border border-slate-700/80 p-5 rounded-xl space-y-4 shadow-sm">
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Thumbnail</span>
                  <div className="border border-dashed border-blue-500/40 hover:border-blue-400 rounded-xl p-5 text-center relative overflow-hidden transition-all bg-[#0a0f1d] cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-2 bg-blue-950/60 rounded-full text-blue-400 border border-blue-900/30">
                        <UploadCloud className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-xs font-mono text-slate-300">
                        {imageFile ? (
                          <span className="text-emerald-400 font-bold">{imageFile.name}</span>
                        ) : (
                          <span>Drop screenshot or image</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Studio File (.rbxm)</span>
                  <div className="border border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-xl p-5 text-center relative overflow-hidden transition-all bg-[#0a0f1d] cursor-pointer">
                    <input 
                      type="file" 
                      accept=".rbxm,.zip" 
                      onChange={handleAssetChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                       <div className="p-2 bg-emerald-950/60 rounded-full text-[#10B981] border border-emerald-900/30">
                        <FileCode className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div className="text-xs font-mono text-slate-300">
                        {assetFile ? (
                          <span className="text-emerald-400 font-extrabold">{assetFile.name}</span>
                        ) : (
                          <span>Upload .rbxm file</span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Max 25 MB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0f1d] border border-slate-700/60 p-3.5 rounded-xl flex gap-3 items-start">
                  <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    <strong className="text-white font-mono uppercase block text-[10px] tracking-widest mb-1">Important Info:</strong> 
                    When you post this, it will be reviewed by the admin team before showing up.
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <CardStudio
              styles={cardStyles}
              title={title}
              price={0}
              isFree={isFree}
              thumbnailUrl={thumbnailPreview}
              category={category}
              onChangeStyles={handleChangeStyles}
            />
          )}
        </div>

        <div className="p-5 bg-[#090c14] border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            {activeTab === "info" ? (
              <button
                type="button"
                onClick={() => setActiveTab("design")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                Next Step: Summary
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab("info")}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 rounded-xl hover:bg-slate-800 cursor-pointer"
                >
                  Back to Parameters
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-extrabold uppercase tracking-wide flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </>
            )}
          </div>
        </div>
        </>
        )}

      </motion.div>
    </div>
  );
}
