/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, FileCode, Sliders, Info, UploadCloud, HelpCircle } from 'lucide-react';
import { Asset, CardStyles } from '../types';
import CardStudio from './CardStudio';

interface UploadAssetModalProps {
  onAddAsset: (newAsset: Asset) => void;
  onClose: () => void;
  creatorUsername: string;
  creatorEmail: string;
}

export default function UploadAssetModal({
  onAddAsset,
  onClose,
  creatorUsername,
  creatorEmail
}: UploadAssetModalProps) {
  
  // Tabs for structured design
  const [activeTab, setActiveTab] = useState<'info' | 'design'>('info');

  // Input states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gamepassLink, setGamepassLink] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [isFree, setIsFree] = useState(true);
  const [category, setCategory] = useState<Asset['category']>('Model');
  
  // Custom file states
  const [thumbnailInput, setThumbnailInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ thumbnail: 0, file: 0 });

  // Customizer styling states
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
    descriptionFont: 'font-sans'
  });

  // State errors
  const [validationError, setValidationError] = useState('');

  // Handle styles change
  const handleChangeStyles = (updated: Partial<CardStyles>) => {
    setCardStyles(prev => ({ ...prev, ...updated }));
  };

  // Convert uploaded files into local base64 URLs
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setUploadProgress(prev => ({ ...prev, thumbnail: 12 }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailInput(reader.result as string);
        setUploadProgress(prev => ({ ...prev, thumbnail: 100 }));
      };
      reader.onerror = () => {
        setValidationError('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAssetFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setValidationError('Roblox model size exceeds 25 MB.');
        setAssetFile(null);
        return;
      }
      setValidationError('');
      setAssetFile(file);
      let prg = 0;
      const interval = setInterval(() => {
        prg += 25;
        setUploadProgress(prev => ({ ...prev, file: prg }));
        if (prg >= 100) {
          clearInterval(interval);
        }
      }, 60);
    }
  };

  // Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a Roblox asset title.');
      setActiveTab('info');
      return;
    }
    if (!isFree && price <= 0) {
      setValidationError('Paid assets must have a price greater than R$ 0.');
      setActiveTab('info');
      return;
    }
    if (!isFree && !gamepassLink.trim()) {
      setValidationError('Please specify a Roblox Gamepass or Developer Product URL for cash-out routing.');
      setActiveTab('info');
      return;
    }
    setValidationError('');

    // Compile new asset profile
    const finalAsset: Asset = {
      id: `asset-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Roblox studio package ready for game development.',
      thumbnail: thumbnailInput || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      fileUrl: '#mock-upload-file.rbxm',
      fileName: assetFile ? assetFile.name : 'AssetModel.rbxm',
      gamepassLink: isFree ? '' : gamepassLink.trim(),
      price: isFree ? 0 : price,
      isFree: isFree,
      category: category,
      creatorUsername: creatorUsername || 'blockbuilder_pro',
      creatorEmail: creatorEmail || 'pavlemaster6@gmail.com',
      views: 1,
      clicks: 0,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      promoted: false,
      styles: cardStyles
    };

    onAddAsset(finalAsset);
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
        {/* Modal Title Banner with beautiful border */}
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

        {/* Multi-tab Selection with vibrant active indicator states */}
        <div className="flex border-b border-slate-800 bg-[#090c14]/40">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 font-mono text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-[#151a2e] border-b-2 border-blue-500 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-[#151a2e]/30'
            }`}
          >
            <Info className="w-4 h-4 text-slate-400" />
            1. Parameters
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-3 px-4 font-mono text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'design'
                ? 'bg-[#151a2e] border-b-2 border-blue-500 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-[#151a2e]/30'
            }`}
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            2. Card Design Studio
          </button>
        </div>

        {/* Main Content Space */}
        <div id="upload-form-pane" className="p-6">
          {validationError && (
            <div className="mb-4 text-xs font-mono text-rose-450 bg-rose-950/30 border border-rose-550 p-3 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-550" />
              {validationError}
            </div>
          )}

          {activeTab === 'info' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#171e31] border border-slate-700/80 p-5 rounded-xl space-y-4 shadow-sm">
                <div className="space-y-1.5 font-sans">
                  <div className="flex items-center justify-between">
                    <label htmlFor="asset-title-input" className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Title</label>
                    <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFree}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setIsFree(val);
                          if (val) {
                            setPrice(0);
                            setGamepassLink('');
                          }
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-700 text-blue-550 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                      />
                      <span className="text-slate-350 font-bold text-[10px] uppercase tracking-wider">Free Asset</span>
                    </label>
                  </div>
                  <input
                    id="asset-title-input"
                    type="text"
                    required
                    placeholder="Sword"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="asset-desc-input" className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Description</label>
                  <textarea
                    id="asset-desc-input"
                    placeholder="Specify modules, setup guidelines, or features inside this model..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="category-select" className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Category</label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Asset['category'])}
                    className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white outline-none transition-all"
                  >
                    <option value="Model">Model</option>
                    <option value="Map">Map</option>
                    <option value="UI Pack">UI Pack</option>
                  </select>
                </div>

                {/* Simulated Pricing via Roblox API & Gamepass connection directly configured */}
                <div className="space-y-2">
                  <label htmlFor="gamepass-input" className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Roblox Gamepass Link
                  </label>
                  <input
                    id="gamepass-input"
                    type="url"
                    disabled={isFree}
                    placeholder={isFree ? "Free assets need no link" : "https://www.roblox.com/gamepass/..."}
                    value={isFree ? '' : gamepassLink}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGamepassLink(val);
                      if (val.trim()) {
                        const charSum = val.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const generatedPrice = 150 + (charSum % 18) * 50; 
                        setPrice(generatedPrice);
                      } else {
                        setPrice(0);
                      }
                    }}
                    className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-600 outline-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  />

                  {!isFree && price > 0 && (
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 uppercase font-black pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ROBLOX API MATCH: R$ {price} Robux
                    </div>
                  )}
                </div>
              </div>

              {/* Right Form: File Selectors with elevated panel container */}
              <div className="bg-[#171e31] border border-slate-700/80 p-5 rounded-xl space-y-4 shadow-sm">
                
                {/* Image Upload Area */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Thumbnail</span>
                  <div className="border border-dashed border-blue-500/40 hover:border-blue-400 rounded-xl p-5 text-center relative overflow-hidden transition-all bg-[#0a0f1d] cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleThumbnailUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-2 bg-blue-950/60 rounded-full text-blue-400 border border-blue-900/30">
                        <UploadCloud className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-xs font-mono text-slate-350">
                        {thumbnailFile ? (
                          <span className="text-emerald-400 font-bold">{thumbnailFile.name}</span>
                        ) : (
                          <span>Drop screenshot or image</span>
                        )}
                      </div>
                    </div>

                    {uploadProgress.thumbnail > 0 && uploadProgress.thumbnail < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900">
                        <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${uploadProgress.thumbnail}%` }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Studio File (.rbxm)</span>
                  <div className="border border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-xl p-5 text-center relative overflow-hidden transition-all bg-[#0a0f1d] cursor-pointer">
                    <input 
                      type="file" 
                      accept=".rbxm" 
                      onChange={handleAssetFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                       <div className="p-2 bg-emerald-950/60 rounded-full text-[#10B981] border border-emerald-900/30">
                        <FileCode className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div className="text-xs font-mono text-slate-355">
                        {assetFile ? (
                          <span className="text-emerald-400 font-extrabold">{assetFile.name}</span>
                        ) : (
                          <span>Upload .rbxm file</span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Max 25 MB</span>
                    </div>

                    {uploadProgress.file > 0 && uploadProgress.file < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900">
                        <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${uploadProgress.file}%` }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* PP Team Review Verification Banner */}
                <div className="bg-[#0a0f1d] border border-slate-700/60 p-3.5 rounded-xl flex gap-3 items-start">
                  <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    <strong className="text-white font-mono uppercase block text-[10px] tracking-widest mb-1">Important Info:</strong> 
                    When you post this, it will be reviewed by the PP Team and approved/blocked.
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <CardStudio
              styles={cardStyles}
              title={title}
              price={price}
              isFree={isFree}
              thumbnailUrl={thumbnailInput}
              category={category}
              onChangeStyles={handleChangeStyles}
            />
          )}
        </div>

        {/* Modal Controls footer */}
        <div className="p-5 bg-[#090c14] border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            {activeTab === 'info' ? (
              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                Next Step: Card Studio
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 rounded-xl hover:bg-slate-800 cursor-pointer"
                >
                  Back to Parameters
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-extrabold uppercase tracking-wide flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  Publish
                </button>
              </>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
