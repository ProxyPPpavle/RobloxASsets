/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CardStyles } from '../types';
import { Sparkles, Eye, LayoutGrid, Check, Droplet, Image as ImageIcon, Flame, UploadCloud, Trash, ThumbsUp, Compass } from 'lucide-react';

interface CardStudioProps {
  styles: CardStyles;
  title: string;
  price: number;
  isFree: boolean;
  thumbnailUrl: string;
  category: string;
  onChangeStyles: (updated: Partial<CardStyles>) => void;
}


const FRAMES = [
  { id: 'none', name: 'No Custom Border', class: '' },
  { id: 'frame-neon-green', name: 'Emerald Core', class: 'frame-neon-green' },
  { id: 'frame-cosmic-blue', name: 'Sapphire Edge', class: 'frame-cosmic-blue' },
  { id: 'frame-golden-sparkle', name: 'Imperial Gold', class: 'frame-golden-sparkle' },
  { id: 'frame-fiery-red', name: 'Crimson Surge', class: 'frame-fiery-red' },
  { id: 'frame-anim-dash', name: 'Cosmic Border', class: 'frame-anim-dash' },
];

const FONTS = [
  { id: 'font-sans', name: 'Inter (Clean Standard)' },
  { id: 'font-display', name: 'Space Grotesk (Tech Display)' },
  { id: 'font-mono', name: 'JetBrains Mono (Developer Accent)' },
];

export default function CardStudio({
  styles,
  title,
  price,
  isFree,
  thumbnailUrl,
  category,
  onChangeStyles
}: CardStudioProps) {
  
  const getFontClass = (id: string) => {
    switch (id) {
      case 'font-sans': return 'font-sans';
      case 'font-display': return 'font-display';
      case 'font-mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const currentFrame = FRAMES.find(f => f.id === styles.frameStyle) || FRAMES[0];

  const currentTitleColor = styles.titleColor || styles.textColor || '#FFFFFF';
  const currentDescColor = styles.descriptionColor || '#9CA3AF';
  const currentTitleFont = styles.titleFont || styles.fontFamily || 'font-sans';
  const currentDescFont = styles.descriptionFont || 'font-sans';

  // Base64 file uploader helper
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChangeStyles({ bgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch text-[#f1f5f9]">
      
      {/* LEFT: Frame Selector Roll & Live Preview Container in One Height-Synced Block */}
      <div className="col-span-1 bg-[#171e31] border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-stretch min-h-[385px] relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.01] via-transparent to-emerald-500/[0.01] rounded-2xl pointer-events-none" />

        {/* Vertical Scroll preset list for decorative borders on Left (w-1/3 on desktop) */}
        <div className="w-full sm:w-[150px] flex flex-col justify-start border-b sm:border-b-0 sm:border-r border-slate-700 pb-4 sm:pb-0 sm:pr-4 space-y-3 z-10 shrink-0">
          <div className="flex items-center gap-1.5 flex-row">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              1. Border
            </span>
          </div>
          
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-cyan-500/15 scrollbar-track-transparent pr-1">
            {FRAMES.map((f) => {
              const isSelected = styles.frameStyle === f.id || (f.id === 'none' && !styles.frameStyle);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChangeStyles({ frameStyle: f.id })}
                  className={`p-2 rounded-xl text-left border text-[11px] font-medium cursor-pointer transition-all shrink-0 sm:shrink-0 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                      : 'border-slate-700 bg-[#0d1222] text-slate-350 hover:text-white hover:bg-[#111625] hover:border-slate-500'
                  }`}
                >
                  <div className="font-semibold truncate">{f.name}</div>
                </button>
              );
            })}
          </div>

          {/* Border Width Customizer Slider */}
          {styles.frameStyle && styles.frameStyle !== 'none' && (
            <div className="pt-2 border-t border-slate-700/60 space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-450 uppercase tracking-wider block">Thickness:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={styles.borderWidth !== undefined ? styles.borderWidth : 1.5}
                  onChange={(e) => onChangeStyles({ borderWidth: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-[#090c14] rounded-lg appearance-none cursor-pointer accent-blue-550"
                  title="Adjust border width"
                />
                <span className="text-[9px] font-mono font-black text-slate-305 shrink-0">
                  {styles.borderWidth !== undefined ? styles.borderWidth : 1.5}px
                </span>
              </div>
              
              <div className="pt-2 flex items-center justify-between gap-2">
                 <span className="text-[9px] font-mono font-bold text-slate-450 uppercase tracking-wider block">Custom Color:</span>
                 <input
                    type="color"
                    value={styles.borderColor || '#3b82f6'}
                    onChange={(e) => onChangeStyles({ borderColor: e.target.value })}
                    className="w-6 h-6 rounded border border-slate-700 bg-transparent cursor-pointer p-0 shrink-0"
                    title="Border color"
                 />
              </div>
            </div>
          )}
        </div>

        {/* Center/Right inside Left side: Unified Live preview card */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 py-2">
          
          <div className="w-full max-w-[245px]">
            <div 
              className={`w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 relative select-none isolate ${currentFrame.class}`}
              style={{
                backgroundColor: styles.bgColor,
                backgroundImage: styles.bgImage ? `url(${styles.bgImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderWidth: styles.frameStyle && styles.frameStyle !== 'none' && styles.borderWidth !== undefined ? `${styles.borderWidth}px` : undefined,
                borderColor: styles.borderColor || undefined,
                borderStyle: styles.frameStyle !== 'none' && styles.borderColor ? 'solid' : undefined,
                transform: 'translate3d(0, 0, 0)'
              }}
            >
              {/* Price Badge on Top Right */}
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center flex-row">
                <span className="text-[10px] font-sans font-black tracking-wide px-2.5 py-1 rounded-lg uppercase border bg-emerald-950/60 text-emerald-400 border-emerald-900/50 shadow-lg">
                  {isFree ? 'FREE' : `R$ ${price}`}
                </span>
              </div>

              {/* Main thumbnail segment */}
              <div className="w-full h-36 overflow-hidden relative bg-[#020308]">
                {thumbnailUrl ? (
                  <img 
                    src={thumbnailUrl} 
                    alt="Asset Preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900 text-slate-500">
                    <ImageIcon className="w-6 h-6 mb-1 opacity-40 text-slate-400" />
                    <span className="text-[10px] font-mono">Awaiting primary asset image</span>
                  </div>
                )}
              </div>

              {/* Details card information */}
              <div className="p-3.5 space-y-2.5 relative z-10 bg-slate-950/85 backdrop-blur-md border-t border-white/5">
                <div>
                  <h3 
                    className={`text-sm font-bold truncate ${getFontClass(currentTitleFont)}`}
                    style={{ color: currentTitleColor }}
                  >
                    {title || 'Sample Roblox Asset'}
                  </h3>
                  <p 
                    className={`text-[10px] text-slate-450 line-clamp-2 mt-1 leading-relaxed ${getFontClass(currentDescFont)}`}
                    style={{ color: currentDescColor }}
                  >
                    Custom features, high performance mechanics built inside Luau code. Fast integration ready.
                  </p>
                </div>

                {/* Micro indicators underneath metadata */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] font-sans font-semibold text-slate-400 gap-1 select-none">
                  <div className="px-2.5 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-[9px] tracking-wide uppercase shadow-md flex items-center gap-1 shrink-0">
                    <span>Get Now</span>
                    <Compass className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 shrink-0" title="Views">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-white text-[10px]">1</span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0" title="Likes">
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-white text-[10px]">0</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT: Precise Design Settings Column (Background colors / local image file & Typography Colors) */}
      <div className="col-span-1 space-y-4 flex flex-col justify-between">
        
        {/* Background customisations with most used colors */}
        <div className="p-5 bg-[#171e31] border border-slate-700/80 rounded-2xl space-y-3.5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          
          <label className="text-[11px] font-mono text-slate-305 uppercase tracking-widest flex items-center gap-1.5 font-bold flex-row">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            2. Background Design
          </label>
          
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Background Color:</span>
              <div className="flex items-center gap-2 flex-row">
                <input
                  type="text"
                  value={styles.bgColor}
                  onChange={(e) => onChangeStyles({ bgColor: e.target.value })}
                  placeholder="#171e31"
                  className="w-full max-w-[125px] bg-[#0d1222] border border-slate-700 focus:border-blue-500 rounded-xl py-1.5 px-3 text-xs text-white font-mono placeholder-slate-600 outline-none transition-all"
                  title="Enter Custom Hex Color Code"
                />
                
                {/* Custom Color Input Dot */}
                <div className="relative flex items-center justify-center shrink-0 w-11 h-8">
                  <input
                    id="custom-bg-color-picker"
                    type="color"
                    value={styles.bgColor.startsWith('#') ? styles.bgColor : '#171e31'}
                    onChange={(e) => onChangeStyles({ bgColor: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20 w-11 h-8"
                    title="Choose from Picker"
                  />
                  <div 
                    className="w-11 h-8 rounded-xl border border-slate-700 shadow-md relative z-10 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: styles.bgColor.startsWith('#') ? styles.bgColor : '#171e31' }}
                  >
                    <Droplet className="w-3.5 h-3.5 bg-black/40 text-slate-200 rounded-full p-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Local file custom graphics background */}
            <div className="pt-3 border-t border-slate-700/60">
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Background Image:</span>
              {styles.bgImage ? (
                <div className="flex items-center justify-between w-full p-2 bg-[#000000]/40 border border-slate-700 rounded-xl flex-row">
                  <div className="flex items-center gap-1.5 truncate flex-row">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[9px] font-mono text-emerald-400 truncate max-w-[130px]">Overlay_Active.png</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangeStyles({ bgImage: '' })}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded cursor-pointer"
                    title="Remove custom graphic"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="relative overflow-hidden flex items-center justify-center w-full p-2.5 border border-dashed border-slate-600 hover:border-slate-500 rounded-xl bg-[#0d1222] cursor-pointer hover:bg-[#111625] transition-colors">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleBgImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1.5 flex-row">
                    <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                    Upload Graphic Image
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Typography colors and fonts settings */}
        <div className="p-5 bg-[#171e31] border border-slate-700/80 rounded-2xl space-y-3.5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />

          <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-bold flex-row">
            <Droplet className="w-3.5 h-3.5 text-emerald-400" />
            3. Font & Text Color
          </label>

          <div className="space-y-2.5">
            {/* Title Customiser */}
            <div className="p-2.5 bg-[#0d1222]/80 border border-slate-700 rounded-xl space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-slate-450 uppercase tracking-wider block">Title Text Styling</span>
              <div className="flex items-center gap-2 flex-row">
                <input
                  type="color"
                  value={currentTitleColor}
                  onChange={(e) => onChangeStyles({ titleColor: e.target.value, textColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-700 bg-transparent cursor-pointer p-0"
                  title="Text color"
                />
                
                <input
                  type="text"
                  value={currentTitleColor}
                  onChange={(e) => onChangeStyles({ titleColor: e.target.value, textColor: e.target.value })}
                  placeholder="#FFFFFF"
                  className="w-16 bg-[#111625] border border-slate-700 focus:border-blue-500 rounded-lg py-0.5 px-2 text-[10px] text-white font-mono placeholder-slate-600 outline-none"
                  title="Title Font Color Hex Code"
                />

                <select
                  value={currentTitleFont}
                  onChange={(e) => onChangeStyles({ titleFont: e.target.value, fontFamily: e.target.value })}
                  className="flex-1 bg-[#111625] border border-slate-700 rounded-lg py-1 px-2 text-[10px] text-white outline-none"
                >
                  {FONTS.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Customiser */}
            <div className="p-2.5 bg-[#0d1222]/80 border border-slate-700 rounded-xl space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-slate-455 uppercase tracking-wider block">Description Text Styling</span>
              <div className="flex items-center gap-2 flex-row">
                <input
                  type="color"
                  value={currentDescColor}
                  onChange={(e) => onChangeStyles({ descriptionColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-700 bg-transparent cursor-pointer p-0"
                  title="Desc color"
                />

                <input
                  type="text"
                  value={currentDescColor}
                  onChange={(e) => onChangeStyles({ descriptionColor: e.target.value })}
                  placeholder="#9CA3AF"
                  className="w-16 bg-[#111625] border border-slate-700 focus:border-blue-500 rounded-lg py-0.5 px-2 text-[10px] text-white font-mono placeholder-slate-600 outline-none"
                  title="Description Font Color Hex Code"
                />

                <select
                  value={currentDescFont}
                  onChange={(e) => onChangeStyles({ descriptionFont: e.target.value })}
                  className="flex-1 bg-[#111625] border border-slate-700 rounded-lg py-1 px-2 text-[10px] text-white outline-none"
                >
                  {FONTS.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}
