/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Eye, ThumbsUp, MousePointerClick, Calendar, ExternalLink, DownloadCloud, CheckCircle } from 'lucide-react';
import { Asset } from '../types';

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
  onPurchaseSuccess: (asset: Asset) => void;
  onLikeToggle: (id: string) => void;
  liked: boolean;
}

export default function AssetDetailModal({
  asset,
  onClose,
  onPurchaseSuccess,
  onLikeToggle,
  liked
}: AssetDetailModalProps) {
  
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadDone, setDownloadDone] = useState(false);

  const handleDownloadAction = () => {
    if (downloading || downloadDone) return;
    setDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadDone(true);
          onPurchaseSuccess(asset);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleBuyAction = () => {
    if (asset.gamepassLink) {
      window.open(asset.gamepassLink, '_blank', 'noreferrer');
    }
    onPurchaseSuccess(asset);
  };

  return (
    <div id="asset-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div 
        id="asset-detail-card"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-3xl bg-[#090C15] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.9)] my-8 grid grid-cols-1 md:grid-cols-12 text-gray-200"
      >
        
        {/* Left Side (Col span 7): Magnified Asset Preview & Meta Metrics Board */}
        <div 
          className="md:col-span-7 min-h-[360px] md:min-h-[480px] h-full relative overflow-hidden flex flex-col justify-between p-5 border-b md:border-b-0 md:border-r border-white/10"
          style={{
            backgroundColor: asset.styles.bgColor,
            backgroundImage: asset.styles.bgImage ? `url(${asset.styles.bgImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {asset.styles.gridEnabled && (
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          )}

          {/* Tiny subtle top frame info */}
          <div className="relative z-10 flex items-center justify-between pb-2">
            <span className="text-[9px] bg-black/80 backdrop-blur-md border border-white/10 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              {asset.category} PREVIEW
            </span>
          </div>

          {/* High-res Enlarged Image Container with no margins to let the asset shine */}
          <div className="my-auto py-3 relative z-10 w-full flex items-center justify-center">
            <div 
              className={`w-full max-h-[290px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative ${asset.styles.frameStyle === 'none' ? 'border border-white/10' : asset.styles.frameStyle || 'border border-white/10'}`}
              style={{
                borderWidth: asset.styles.frameStyle && asset.styles.frameStyle !== 'none' && asset.styles.borderWidth !== undefined ? `${asset.styles.borderWidth}px` : undefined
              }}
            >
              <img 
                src={asset.thumbnail} 
                alt={asset.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full min-h-[200px] max-h-[290px] object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* Left Column details: Highly stylized Neutral Action Counters */}
          <div className="relative z-10 mt-3 p-3.5 bg-black/75 border border-white/5 rounded-xl space-y-3">
            {/* Engagement statistics styled with neutral colors */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tight flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-gray-400" /> Views
                </span>
                <p className="text-xs font-mono font-bold text-gray-300 mt-1">{asset.views + 1}</p>
              </div>
              
              <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tight flex items-center justify-center gap-1">
                  <MousePointerClick className="w-3.5 h-3.5 text-gray-400" /> Clicks
                </span>
                <p className="text-xs font-mono font-bold text-gray-300 mt-1">{asset.clicks + (downloadDone ? 1 : 0)}</p>
              </div>

              <button
                type="button"
                onClick={() => onLikeToggle(asset.id)}
                className="p-2 rounded-lg bg-pink-950/15 border border-pink-500/20 hover:bg-pink-950/30 transition-all cursor-pointer"
              >
                <span className={`text-[9px] font-mono uppercase tracking-tight flex items-center justify-center gap-1 ${liked ? 'text-pink-400 font-bold' : 'text-gray-400'}`}>
                  <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-pink-500 text-pink-400' : 'text-pink-550'}`} /> Like
                </span>
                <p className="text-xs font-mono font-bold text-pink-450 mt-1">{asset.likes + (liked ? 1 : 0)}</p>
              </button>
            </div>
          </div>
        </div>
 
        {/* Right Side (Col span 5): Metadata & Unified Buy Board */}
        <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-[#0B0D14]">
          
          <div className="space-y-5">
            {/* Header Close button & Creator profile info */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[11px] font-mono font-extrabold text-white">
                  {asset.creatorUsername.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-gray-400 font-extrabold">@{asset.creatorUsername}</span>
                  <span className="text-[10px] font-mono text-gray-500">Role: {asset.category === 'Model' ? 'Modeler' : asset.category === 'UI Pack' ? 'UI Artist' : 'Designer'}</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
 
            {/* Asset Header Title and Description only */}
            <div className="space-y-3">
              <h1 className="text-lg font-display font-black tracking-tight text-white leading-tight">
                {asset.title}
              </h1>
              <p className="text-xs text-gray-300 leading-relaxed max-h-[180px] overflow-y-auto pr-1">
                {asset.description}
              </p>
            </div>
          </div>
 
          {/* Unified Premium Action Button */}
          <div className="pt-4 border-t border-white/10">
            {asset.isFree ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadAction}
                  disabled={downloading}
                  className="w-full py-3 bg-white hover:bg-gray-100 disabled:opacity-50 text-black rounded-lg text-xs font-mono font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                >
                  {downloading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Extracting File ({downloadProgress}%)
                    </>
                  ) : downloadDone ? (
                    <>
                      <CheckCircle className="w-4.5 h-4.5 text-black" />
                      Downloaded (.rbxm)
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-4.5 h-4.5" />
                      Download (.rbxm)
                    </>
                  )}
                </button>
                {downloadDone && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-gray-300 font-mono text-center flex items-center justify-center gap-1 p-1 bg-gray-900 border border-gray-800 rounded-md"
                  >
                    Delivered to your workspace Inbox
                  </motion.p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBuyAction}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Buy for R$ {asset.price} Robux</span>
                <ExternalLink className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
