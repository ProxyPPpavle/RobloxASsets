/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Save, User, Camera, Upload } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onClose: () => void;
}

export default function EditProfileModal({
  profile,
  onSaveProfile,
  onClose
}: EditProfileModalProps) {
  
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const updatedProfile: UserProfile = {
      ...profile,
      username: username.trim(),
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    };

    onSaveProfile(updatedProfile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be under 2MB.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="edit-profile-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        id="edit-profile-card"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-sm bg-[#111625] border border-slate-700/80 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-[#f1f5f9]"
      >
        {/* Header Banner */}
        <div className="p-5 bg-[#090c14] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600/20 text-blue-450 rounded border border-blue-500/30">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Edit Profile</h3>
              <p className="text-[10px] text-slate-400">Update your public display identity</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="p-5 space-y-5">
          {uploadError && (
            <div className="text-[10px] font-mono text-rose-450 bg-rose-950/30 border border-rose-550 border-dashed p-2 rounded-lg text-center">
              {uploadError}
            </div>
          )}

          {/* Picture Selector & Direct Avatar Circle Preview */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-2">
            <div className="relative group w-20 h-20">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/80 shadow-md bg-slate-900 flex items-center justify-center">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'}
                  alt="Avatar Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={triggerFileSelect}
                className="absolute inset-0 bg-slate-950/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white cursor-pointer"
                title="Change Avatar Picture"
              >
                <Camera className="w-5 h-5 text-slate-300" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileSelect}
                className="py-1 px-2.5 bg-[#171e31] hover:bg-[#1f2945] border border-slate-700/60 rounded-lg text-[9px] font-mono font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3 text-slate-400" />
                Upload File
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="p-username" className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Profile Name</label>
              <input
                id="p-username"
                type="text"
                required
                maxLength={25}
                placeholder="e.g. luau_wizard"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Direct Avatar Image URL fall-back */}
            <div className="space-y-1.5">
              <label htmlFor="p-avatar-url" className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">or Picture Image URL</label>
              <input
                id="p-avatar-url"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all placeholder:text-[10px]"
              />
            </div>
          </div>

          {/* Save & Footer actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
