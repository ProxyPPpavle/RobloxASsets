/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Trash2, DownloadCloud, CheckCircle, MailOpen, AlertCircle, Inbox } from 'lucide-react';
import { Message } from '../types';

interface InboxSectionProps {
  messages: Message[];
  onDeleteMessage: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

export default function InboxSection({
  messages,
  onDeleteMessage,
  onMarkAsRead
}: InboxSectionProps) {

  // Simulated download triggers specific to messages
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloadSuccess, setDownloadSuccess] = useState<Record<string, boolean>>({});

  const triggerInboxDownload = (msgId: string, fileName: string) => {
    if (downloadProgress[msgId] !== undefined) return;

    setDownloadProgress(prev => ({ ...prev, [msgId]: 0 }));
    
    let prg = 0;
    const interval = setInterval(() => {
      prg += 20;
      setDownloadProgress(prev => ({ ...prev, [msgId]: prg }));
      if (prg >= 100) {
        clearInterval(interval);
        setDownloadSuccess(prev => ({ ...prev, [msgId]: true }));
      }
    }, 120);
  };

  return (
    <div id="inbox-section-container" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Inbox className="w-4 h-4 text-gray-500" />
          Inbox & Received Files ({messages.filter(m => !m.isRead).length})
        </h3>
        {messages.length > 0 && (
          <span className="text-[10px] font-mono text-gray-650">
            Hover to dismiss message
          </span>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {messages.length === 0 ? (
          <motion.div
            key="empty-inbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center bg-[#13192b] border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-inner"
          >
            <Mail className="w-8 h-8 text-gray-600 mb-1" />
            <p className="text-xs text-gray-300">Your inbox is empty.</p>
            <p className="text-[10px] text-gray-500">All purchased models and official platform reports will appear here.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isUnread = !message.isRead;
              const hasDownload = !!message.fileUrl;
              const isDownloading = downloadProgress[message.id] !== undefined && (downloadProgress[message.id] < 100);
              const isDownloaded = downloadSuccess[message.id];

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => onMarkAsRead(message.id)}
                  className="group relative p-4 rounded-xl bg-[#13192b] border border-slate-800 transition-all duration-300 hover:border-slate-700 hover:shadow-lg hover:bg-[#151a2e]"
                >
                  {/* Delete Button on Hover */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMessage(message.id);
                    }}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black transition-all cursor-pointer border border-red-500/20"
                    title="Dismiss Notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-2 pr-6">
                    {/* Header line */}
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 bg-white/5 border border-white/5 text-gray-400`}>
                        {isUnread ? <Mail className="w-3 h-3 text-white" /> : <MailOpen className="w-3 h-3 text-gray-500" />}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-semibold ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                          {message.title}
                        </h4>
                        <span className="text-[9px] font-mono text-gray-500">{message.date}</span>
                      </div>
                    </div>

                    {/* Body text */}
                    <p className="text-[11px] text-gray-400 leading-relaxed pl-8.5">
                      {message.body}
                    </p>

                    {/* Direct Roblox File Exporter with Progress */}
                    {hasDownload && (
                      <div className="pl-8.5 pt-1">
                        <div className="bg-[#0e1322] border border-slate-800/80 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-white/5 rounded flex items-center justify-center text-gray-400 border border-white/5">
                              <DownloadCloud className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.2">
                              <p className="text-[10px] font-mono text-gray-300 truncate max-w-[180px]">
                                {message.fileName}
                              </p>
                              <p className="text-[8px] font-mono text-gray-500">File (.rbxm)</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isDownloading || isDownloaded}
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerInboxDownload(message.id, message.fileName || 'Asset.rbxm');
                            }}
                            className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                              isDownloaded
                                ? 'bg-white/5 text-gray-400 border border-white/5'
                                : isDownloading
                                ? 'bg-white/5 text-blue-400 border border-white/5'
                                : 'bg-[#1E202B] hover:bg-[#2A2D3D] text-white border border-white/10'
                            }`}
                          >
                            {isDownloaded ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                Downloaded
                              </>
                            ) : isDownloading ? (
                              <>
                                <svg className="animate-spin h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {downloadProgress[message.id]}%
                              </>
                            ) : (
                              'Download'
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
