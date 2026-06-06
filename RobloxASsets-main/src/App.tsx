/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  User, 
  Plus, 
  Search, 
  Flame, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Coins, 
  Eye, 
  Maximize2, 
  Trash2, 
  CheckCircle, 
  Sparkles, 
  Filter, 
  Grid3X3,
  ThumbsUp,
  FileCode2,
  ListFilter,
  Check,
  AlertCircle,
  Github,
  Twitter,
  Globe,
  Youtube
} from 'lucide-react';

import { Asset, Message, UserProfile } from './types';
import { INITIAL_ASSETS, INITIAL_MESSAGES, INITIAL_USER } from './initialData';

// Subcomponents imports
import BackgroundGrid from './components/BackgroundGrid';
import LoginModal from './components/LoginModal';
import UploadAssetModal from './components/UploadAssetModal';
import AssetDetailModal from './components/AssetDetailModal';
import InboxSection from './components/InboxSection';
import EditProfileModal from './components/EditProfileModal';

export default function App() {
  
  // Storage Synchronization Helpers
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rblx_stored_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('rblx_stored_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('rblx_stored_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [likedAssetsIds, setLikedAssetsIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('rblx_stored_likes');
    return saved ? JSON.parse(saved) : ['asset-1'];
  });

  // Admin Queue Simulation 
  const [pendingSubmissions, setPendingSubmissions] = useState<Asset[]>([]);

  // Page Routing State
  const [activePage, setActivePage] = useState<'feed' | 'profile' | 'admin'>('feed');

  // Interactive Dialog Windows Controls
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeDetailAsset, setActiveDetailAsset] = useState<Asset | null>(null);

  // Search & Filtering Systems
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'top' | 'free' | 'paid'>('newest');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Trigger feedback visual flags
  const [notifBubble, setNotifBubble] = useState<string | null>(null);

  // Sync to standard local Storage on revisions
  useEffect(() => {
    localStorage.setItem('rblx_stored_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rblx_stored_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('rblx_stored_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('rblx_stored_likes', JSON.stringify(likedAssetsIds));
  }, [likedAssetsIds]);

  const showToast = (text: string) => {
    setNotifBubble(text);
    setTimeout(() => {
      setNotifBubble(null);
    }, 3000);
  };

  // State Updates Handlers
  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setIsLoginOpen(false);
    showToast(`Successfully logged in as @${profile.username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('feed');
    showToast('Logged out. Accessing as developer guest.');
  };

  const handleAddAsset = (newAsset: Asset) => {
    // Add to curation pipeline if they are user or admin. Let's redirect to admin for preview, or add directly to assets list!
    // As in our specs: let's push directly to our assets list so they see it instantly in the feed!
    setAssets(prev => [newAsset, ...prev]);
    setIsUploadOpen(false);
    showToast(`New Roblox asset "${newAsset.title}" published successfully! 🚀`);
    setActivePage('feed');
  };

  const handleApplyProfileEdit = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    setIsEditProfileOpen(false);
    showToast('Profile layout updated successfully!');
  };

  const handleLikeToggle = (id: string) => {
    if (likedAssetsIds.includes(id)) {
      setLikedAssetsIds(prev => prev.filter(x => x !== id));
      showToast('Removed like from asset.');
    } else {
      setLikedAssetsIds(prev => [...prev, id]);
      showToast('Liked this Roblox asset!');
    }
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    showToast('Asset removed successfully.');
  };

  // Simulated purchase logic
  const handlePurchaseSuccess = (asset: Asset) => {
    // Increment telemetry counters
    setAssets(prev => prev.map(a => {
      if (a.id === asset.id) {
        return { ...a, clicks: a.clicks + 1, views: a.views + 2 };
      }
      return a;
    }));

    // Insert purchase message inside Inbox
    const isAlreadyCredited = messages.some(m => m.title.includes(asset.title));
    if (!isAlreadyCredited) {
      const purchaseMessage: Message = {
        id: `msg-purchase-${Date.now()}`,
        title: `📥 File Received: ${asset.title}`,
        body: `You have successfully downloaded or purchased "${asset.title}". The Roblox file (.rbxm) is ready to be downloaded to your computer from this inbox window. Thanks for your support!`,
        date: new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        fileUrl: asset.fileUrl,
        fileName: asset.fileName,
        isRead: false,
        isSuccessPurchase: true
      };
      setMessages(prev => [purchaseMessage, ...prev]);
    }
    
    showToast(`File "${asset.fileName}" secured in your Inbox!`);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    showToast('Inbox message removed.');
  };

  const handleMarkAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  // Simulated Admin Review Process
  const generateSimulatedModerationItem = () => {
    const mockPendingReview: Asset = {
      id: `pending-${Date.now()}`,
      title: 'Neon Particle Spark Pack (Pending)',
      description: 'Futuristic sparks emitter, perfect for Sci-Fi gun shootouts and vehicle exhausts. Fully customizable layout speed and colors.',
      thumbnail: 'https://images.unsplash.com/photo-1541462608141-2f5233b8a3e1?w=600&auto=format&fit=crop&q=80',
      fileUrl: '#neon-sparks-test.rbxm',
      fileName: 'Neon_Sparks_Exh.rbxm',
      gamepassLink: '',
      price: 0,
      isFree: true,
      category: 'Model',
      creatorUsername: 'roblox_designer_x',
      creatorEmail: 'prodesigner@gmail.com',
      views: 12,
      clicks: 0,
      likes: 0,
      createdAt: '2026-05-30',
      promoted: false,
      styles: {
        bgColor: '#020617',
        bgImage: '',
        textColor: '#ec4899',
        fontFamily: 'font-display',
        frameStyle: 'frame-anim-dash',
        gridEnabled: true
      }
    };
    setPendingSubmissions(prev => [mockPendingReview, ...prev]);
    showToast('A new asset mock has been pushed to the Admin Curation Queue.');
  };

  const handleApprovePendingAsset = (pendingAsset: Asset) => {
    const approved: Asset = {
      ...pendingAsset,
      id: `asset-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssets(prev => [approved, ...prev]);
    setPendingSubmissions(prev => prev.filter(a => a.id !== pendingAsset.id));
    showToast(`Asset "${pendingAsset.title}" is APPROVED and deployed to the live feed! 🟢`);
  };

  const handleRejectPendingAsset = (pendingId: string) => {
    setPendingSubmissions(prev => prev.filter(a => a.id !== pendingId));
    showToast('Asset has been dynamic rejected and removed from review. 🔴');
  };

  // Filters logic 
  const filteredAssets = assets.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.creatorUsername.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return sortDirection === 'desc' 
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt);
    }
    if (sortBy === 'top') {
      const aScore = a.views + a.likes * 5;
      const bScore = b.views + b.likes * 5;
      return sortDirection === 'desc' ? bScore - aScore : aScore - bScore;
    }
    if (sortBy === 'free') {
      return a.isFree === b.isFree ? 0 : a.isFree ? -1 : 1;
    }
    if (sortBy === 'paid') {
      // Prioritize paid assets at top, free at bottom
      if (a.isFree && !b.isFree) return 1;
      if (!a.isFree && b.isFree) return -1;
      // Both are paid or both free, sort by price
      return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

  // Promoter toggle trigger 
  const handleSortClick = (id: 'newest' | 'top' | 'free' | 'paid') => {
    if (sortBy === id) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(id);
      if (id === 'paid') {
        setSortDirection('asc'); // cheapest first on first click
      } else {
        setSortDirection('desc'); // newest / top first on first click
      }
    }
  };

  const handleTogglePromoted = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        showToast(a.promoted ? 'Promotion stopped for this asset.' : 'Asset highlighted! Promotion active.');
        return { ...a, promoted: !a.promoted };
      }
      return a;
    }));
  };

  // Calculate cumulative stats for user profile page display
  const myPosts = assets.filter(a => a.creatorEmail === (user?.email || 'pavlemaster6@gmail.com'));
  const calculatedViews = myPosts.reduce((acc, current) => acc + current.views, 0) + (user?.totalViews || 0);
  const calculatedClicks = myPosts.reduce((acc, current) => acc + current.clicks, 0) + (user?.totalClicks || 0);
  const calculatedEarnings = myPosts.reduce((acc, current) => acc + (current.clicks * current.price * 0.7), 0) + (user?.estimatedEarnings || 15400); // 70% Roblox creator cut

  return (
    <div className="relative min-h-screen pb-28 pt-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col z-10 transition-all duration-300">
      
      {/* 1. Ambient Background lines */}
      <BackgroundGrid />

      {/* 2. Top Header Portal */}
      <header className="w-full flex items-center justify-between mb-12 pb-5 border-b border-slate-800 relative z-20">
        <div 
          onClick={() => setActivePage('feed')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-display font-black text-white group-hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-900/30">
            A
          </div>
          <span className="text-xl font-display font-bold text-white tracking-tight">
            Assets<span className="text-blue-550 font-extrabold">PP</span>
          </span>
        </div>

        <nav className="flex items-center gap-4">
          {/* User auth state buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-sans font-semibold text-emerald-400 hidden sm:inline">@{user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-sans font-semibold text-slate-400 hover:text-white py-1.5 px-3 hover:bg-slate-800 border border-transparent rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          ) : (
            <button
               type="button"
               onClick={() => setIsLoginOpen(true)}
               className="text-xs font-sans text-white font-bold bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* Toast Notification Alert Overlay */}
      <AnimatePresence>
        {notifBubble && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 py-3 px-5 bg-white border border-slate-200 rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.08)] flex items-center gap-2 max-w-sm"
          >
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-300 font-sans">{notifBubble}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Page Router Container */}
      <main className="flex-grow z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* PAGE A: MAIN ASSETS FEED */}
          {activePage === 'feed' && (
            <motion.div
              key="feed-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Dynamic Header Vibe */}
              <div className="text-center space-y-3.5 pt-8 max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight whitespace-nowrap">
                  Don't waste <span className="text-blue-400">your time...</span>
                </h1>
                <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-md mx-auto">
                  Sell and buy assets the simple way.
                </p>
              </div>

               {/* Grid Search & Filtering Section */}
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Search Bar Input Container */}
                <div className="relative shadow-[0_4px_25px_rgba(0,0,0,0.4)] rounded-2xl">
                  <input
                    type="text"
                    required
                    placeholder="Search titles, creator @usernames, maps, UI packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#13192b] border border-slate-800 hover:border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl py-4.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                  />
                  <Search className="absolute left-4 top-5 text-slate-500 w-5 h-5 pointer-events-none" />
                </div>

                {/* Sorting and Tags Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {/* Category Filter list with clean styling */}
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Model', 'Map', 'UI Pack'].map((cat) => {
                      const isActive = categoryFilter === cat;
                      let classStyles = 'bg-[#13192b] text-slate-400 hover:bg-slate-800/80 hover:text-white border border-slate-800';
                      if (isActive) {
                        classStyles = 'bg-blue-600 border border-blue-500 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)]';
                      }
                      return (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all duration-200 cursor-pointer ${classStyles}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Horizontal Sort Filter checkboxes */}
                  <div className="flex items-center gap-1 bg-[#13192b] border border-slate-800 p-1 rounded-xl">
                    {[
                      { id: 'newest', name: 'Newest' },
                      { id: 'top', name: 'Best' },
                      { id: 'free', name: 'Free' },
                      { id: 'paid', name: 'Paid' }
                    ].map((sort) => {
                      const isOptionActive = sortBy === sort.id;
                      const arrowIndicator = isOptionActive && sort.id !== 'free' 
                        ? (sortDirection === 'desc' ? ' ↓' : ' ↑') 
                        : '';
                      return (
                        <button
                          key={sort.id}
                          onClick={() => handleSortClick(sort.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all duration-200 ${
                            isOptionActive
                              ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                              : 'text-slate-400 hover:text-white bg-transparent'
                          }`}
                        >
                          {sort.name}{arrowIndicator}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Feed Grid System */}
              {filteredAssets.length === 0 ? (
                <div className="text-center p-12 bg-[#13192b] border border-dashed border-slate-800 rounded-2xl max-w-sm mx-auto space-y-2 shadow-sm">
                  <p className="text-sm font-bold text-white">No assets found</p>
                  <p className="text-xs text-slate-400">Try modifying your query or category filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                  {filteredAssets.map((asset) => {
                    const hasLiked = likedAssetsIds.includes(asset.id);
                    
                    // Design checks for unified preview system
                    const isStandardBg = !asset.styles.bgImage && (!asset.styles.bgColor || asset.styles.bgColor === '#0A0B10' || asset.styles.bgColor === '#020617' || asset.styles.bgColor === '#05070f' || asset.styles.bgColor === '#0A0D14' || asset.styles.bgColor === '#05070A' || asset.styles.bgColor === '#090514' || asset.styles.bgColor.startsWith('linear-gradient'));
                    const cardBg = isStandardBg ? '#13192b' : asset.styles.bgColor;
                    const cardTextColor = isStandardBg ? '#FFFFFF' : (asset.styles.titleColor || asset.styles.textColor || '#FFFFFF');
                    const cardTextDescColor = isStandardBg ? '#94A3B8' : (asset.styles.descriptionColor || '#E2E8F0');
                    const hasPulse = asset.styles.frameStyle && asset.styles.frameStyle !== 'none';

                    return (
                      <motion.div
                        key={asset.id}
                        layoutId={`asset-card-layout-${asset.id}`}
                        onClick={() => {
                          setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, views: a.views + 1 } : a));
                          setActiveDetailAsset(asset);
                        }}
                        className={`group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col relative select-none isolate ${
                          hasPulse ? asset.styles.frameStyle : 'border border-slate-850 hover:border-slate-700/80 hover:shadow-[0_0_25px_rgba(37,99,235,0.15)] bg-[#13192b]'
                        }`}
                        style={{
                          backgroundColor: cardBg,
                          backgroundImage: asset.styles.bgImage ? `url(${asset.styles.bgImage})` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderWidth: hasPulse && asset.styles.borderWidth !== undefined ? `${asset.styles.borderWidth}px` : undefined,
                          transform: 'translate3d(0, 0, 0)'
                        }}
                      >
                        {/* Static Grid Effect inside card if enabled */}
                        {asset.styles.gridEnabled && (
                          <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
                        )}

                        {/* Minimal Emerald Green Price tag on top right for ultimate unity */}
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                          <span className="text-[10px] font-sans font-black tracking-wide px-2.5 py-1 rounded-lg uppercase border bg-emerald-950/60 text-emerald-400 border-emerald-900/50 shadow-lg">
                            {asset.isFree ? 'FREE' : `R$ ${asset.price}`}
                          </span>
                        </div>

                        {/* Thumbnail view */}
                        <div className="w-full h-44 overflow-hidden relative bg-slate-900">
                          <img 
                            src={asset.thumbnail} 
                            alt={asset.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>

                        {/* Text and stats board */}
                        <div className={`p-4 space-y-3 relative z-10 flex-grow flex flex-col justify-between ${isStandardBg ? 'bg-[#111625]/90 border-t border-slate-800' : 'bg-slate-950/75 backdrop-blur-md border-t border-white/5'}`}>
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold truncate font-sans"
                                style={{ color: cardTextColor }}>
                              {asset.title}
                            </h3>
                            <p className="text-xs line-clamp-2 leading-relaxed pr-6 md:pr-8"
                               style={{ color: cardTextDescColor }}>
                              {asset.description}
                            </p>
                          </div>

                          <div className={`flex items-center justify-between pt-3 border-t text-[10px] font-sans font-semibold gap-1 select-none ${isStandardBg ? 'border-slate-800 text-slate-500' : 'border-white/5 text-slate-400'}`}>
                            <button
                              type="button"
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[9px] tracking-wide uppercase transition-all shadow-md flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                            >
                              <span>Get Now</span>
                              <Compass className="w-3 h-3" />
                            </button>
                            <div className="flex items-center gap-2.5 shrink-0">
                              <span className="flex items-center gap-1 shrink-0" title="Views">
                                <Eye className={`w-3.5 h-3.5 ${isStandardBg ? 'text-blue-500' : 'text-blue-450'}`} />
                                <span className={isStandardBg ? 'text-slate-400 font-bold' : 'text-white'}>{asset.views}</span>
                              </span>
                              <span className="flex items-center gap-1 shrink-0" title="Likes">
                                <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'text-pink-500 fill-pink-500' : isStandardBg ? 'text-slate-400' : 'text-slate-500'}`} />
                                <span className={hasLiked ? 'text-pink-500 font-bold' : isStandardBg ? 'text-slate-400' : 'text-white'}>{asset.likes + (hasLiked ? 1 : 0)}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* PAGE B: PROFILE & DEVELOPER DASHBOARD */}
          {activePage === 'profile' && (
            <motion.div
              key="profile-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pt-4 font-sans"
            >
              
              {/* Creator Card Hub Banner */}
              <div className="bg-[#151b2d] border border-slate-700/90 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-xl shadow-slate-950/50">
                <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 bg-slate-900 shadow-xl shrink-0">
                    <img 
                      src={user ? user.avatarUrl : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'} 
                      alt="Profile Avatar" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-sans font-extrabold tracking-tight text-white mb-0.5">
                      {user ? user.username : 'pavlemaster6'}
                    </h2>
                    <p className="text-xs text-slate-350">{user ? user.email : 'pavlemaster6@gmail.com'}</p>
                    <span className="text-[10px] font-sans font-semibold text-slate-400 bg-slate-950/60 px-2.5 py-0.5 rounded-full mt-2 inline-block border border-slate-800">Member Since: {user ? user.memberSince : '5/29/2026'}</span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-900/30 border border-blue-500/30 hover:scale-[1.02] active:scale-95"
                  >
                    Edit Profile ⚙️
                  </button>
                </div>
              </div>

              {/* Developer stats tiles with supreme background contrast */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                
                {/* Views */}
                <div className="bg-[#151b2d] border border-slate-700 hover:border-slate-600 hover:bg-[#192138] rounded-2xl p-4.5 relative overflow-hidden flex flex-col justify-between h-24 shadow-lg shadow-slate-950/40 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-blue-400">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-sans font-bold text-slate-400 tracking-wider uppercase block">Total Views</span>
                    <p className="text-2xl font-sans font-black text-blue-405 leading-none">{calculatedViews}</p>
                  </div>
                </div>

                {/* Clicks */}
                <div className="bg-[#151b2d] border border-slate-700 hover:border-slate-600 hover:bg-[#192138] rounded-2xl p-4.5 relative overflow-hidden flex flex-col justify-between h-24 shadow-lg shadow-slate-950/40 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-emerald-450">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-sans font-bold text-slate-400 tracking-wider uppercase block">Total Clicks</span>
                    <p className="text-2xl font-sans font-black text-emerald-400 leading-none">{calculatedClicks}</p>
                  </div>
                </div>

                {/* Earnings */}
                <div className="bg-[#151b2d] border border-slate-700 hover:border-slate-600 hover:bg-[#192138] rounded-2xl p-4.5 relative overflow-hidden flex flex-col justify-between h-24 shadow-lg shadow-slate-950/40 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-amber-500">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-sans font-bold text-slate-400 tracking-wider uppercase block">Estimated Earnings</span>
                    <p className="text-2xl font-sans font-black text-amber-500 leading-none">R$ {Math.round(calculatedEarnings)}</p>
                  </div>
                </div>

              </div>

              {/* Sub features Columns: My posts & Inbox */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Left Side: My Posts */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                    My Assets ({myPosts.length})
                  </h3>

                  {myPosts.length === 0 ? (
                    <div className="p-8 text-center bg-[#13192b] border border-dashed border-slate-800 rounded-xl">
                      <p className="text-xs text-gray-400">You have not published any models yet.</p>
                      <button
                        type="button"
                        onClick={() => setIsUploadOpen(true)}
                        className="mt-3 text-xs text-gray-300 hover:underline font-mono"
                      >
                        Publish your first Roblox asset +
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myPosts.map((myAsset) => (
                        <div
                          key={myAsset.id}
                          className="bg-[#111625] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-3 group relative transition-all duration-200 hover:border-slate-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-[#151a2e]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-black/40 rounded-lg overflow-hidden shrink-0 border border-white/5">
                              <img 
                                src={myAsset.thumbnail} 
                                alt={myAsset.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="space-y-0.5 truncate max-w-[180px] sm:max-w-[300px]">
                              <h4 className="text-xs font-bold text-white truncate">{myAsset.title}</h4>
                              <p className="text-[9px] font-mono flex items-center gap-3">
                                <span className="text-[#10B981] font-extrabold">{myAsset.isFree ? 'FREE' : `R$ ${myAsset.price}`}</span>
                                <span className="flex items-center gap-1 text-blue-500 font-extrabold" title="Views">
                                  <Eye className="w-3 h-3 text-blue-500" />
                                  <span>{myAsset.views}</span>
                                </span>
                                <span className="flex items-center gap-1 text-emerald-400 font-extrabold" title="Clicks">
                                  <Compass className="w-3 h-3 text-emerald-400" />
                                  <span>{myAsset.clicks}</span>
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Discreet buttons container, visible ONLY on hover! */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {/* Promoted highlight bolt */}
                            <button
                              type="button"
                              onClick={(e) => handleTogglePromoted(myAsset.id, e)}
                              className={`p-1.5 rounded hover:bg-white/5 transition-all cursor-pointer ${
                                myAsset.promoted 
                                  ? 'text-amber-400' 
                                  : 'text-gray-600 hover:text-white'
                              }`}
                              title={myAsset.promoted ? "Stop highlight" : "Highlight item"}
                            >
                              <Flame className="w-3.5 h-3.5" />
                            </button>

                            {/* Trash Delete button - hot red styling to replace dull grey */}
                            <button
                              type="button"
                              onClick={() => handleDeleteAsset(myAsset.id)}
                              className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-black transition-all cursor-pointer border border-rose-500/20"
                              title="Delete model"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Inbox messages integration */}
                <div className="lg:col-span-5">
                  <InboxSection
                    messages={messages}
                    onDeleteMessage={handleDeleteMessage}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>

              </div>

            </motion.div>
          )}

          {/* PAGE C: ADMIN DASHBOARD queue moderation */}
          {activePage === 'admin' && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6 pt-4"
            >
              
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-2xl font-display font-semibold tracking-tight text-white flex items-center gap-2">
                  Admin Dashboard 🛡️
                </h1>
                <p className="text-xs text-gray-400">
                  Review and moderate pending asset submissions.
                </p>
              </div>

              {pendingSubmissions.length === 0 ? (
                <div className="p-10 text-center bg-[#0F131E] border border-white/5 rounded-2xl max-w-xl mx-auto space-y-4 flex flex-col items-center justify-center">
                  <span className="text-sm font-semibold text-white">All caught up!</span>
                  <p className="text-xs text-gray-500 max-w-sm">
                    There are no pending posts awaiting your approval. Everyone is behaving gracefully!
                  </p>

                  <div className="pt-3 border-t border-white/5 w-full">
                    <span className="text-[10px] text-gray-500 font-mono block mb-2">Simulate curation queue:</span>
                    <button
                      type="button"
                      onClick={generateSimulatedModerationItem}
                      className="py-2.5 px-4 bg-blue-600 border border-blue-500 hover:bg-blue-700 text-white font-mono font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 mx-auto cursor-pointer shadow-[0_4px_15px_rgba(37,99,235,0.35)]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                      Create pending submission mock
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>Pending curation submissions ({pendingSubmissions.length})</span>
                    <span>Pending Queue</span>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {pendingSubmissions.map((pending) => (
                      <motion.div
                        key={pending.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#0b0c16] border border-blue-900/35 p-5 rounded-2xl space-y-4 shadow-xl"
                      >
                        {/* Meta header info */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-white/5 text-gray-300 border border-white/5 px-2 py-0.5 rounded-md">
                              {pending.category}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                              By author: <strong className="text-white font-normal">@{pending.creatorUsername}</strong>
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-white">
                            {pending.isFree ? 'FREE' : `R$ ${pending.price}`}
                          </span>
                        </div>

                        {/* Title & Preview picture */}
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                            <img src={pending.thumbnail} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white text-display">{pending.title}</h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">
                              {pending.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Styles diagnostic config representation */}
                        <div className="p-3 bg-slate-950/75 rounded-lg text-[9px] font-mono text-gray-400 grid grid-cols-2 gap-2 border border-white/5">
                          <div><span className="text-gray-500">Font:</span> {pending.styles.fontFamily}</div>
                          <div><span className="text-gray-500">Frame:</span> {pending.styles.frameStyle || 'none'}</div>
                          <div><span className="text-gray-500">Grid Mesh:</span> {pending.styles.gridEnabled ? 'ON' : 'OFF'}</div>
                          <div><span className="text-gray-500">File:</span> {pending.fileName}</div>
                        </div>

                        {/* Decision Buttons */}
                        <div className="flex gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => handleRejectPendingAsset(pending.id)}
                            className="flex-1 py-1.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                          >
                            Reject 🔴
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprovePendingAsset(pending)}
                            className="flex-1 py-1.5 bg-emerald-600 border border-emerald-500 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wide transition-all cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                          >
                            Approve 🟢
                          </button>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3.5 Premium Sleek Footer */}
      <footer className="w-full mt-16 pt-12 pb-24 border-t border-slate-800 relative z-20 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Logo & Slogan Column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-display font-black text-white shadow-md">
                A
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Assets<span className="text-blue-500 font-extrabold">PP</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Don't waste your time looking elsewhere. The ultimate hub to discover, buy, and sell high-end Roblox script systems, detailed layouts, UI modules, and full-scale custom map templates.
            </p>
            <div className="flex items-center gap-3.5 pt-2 text-slate-405">
              <a href="#discord" className="w-8 h-8 rounded-lg bg-[#13192b] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer" title="Discord">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#twitter" className="w-8 h-8 rounded-lg bg-[#13192b] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer" title="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#youtube" className="w-8 h-8 rounded-lg bg-[#13192b] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#github" className="w-8 h-8 rounded-lg bg-[#13192b] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Legal / Policies Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Legal & Info</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#privacy" className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</a>
              </li>
              <li>
                <a href="#dmca" className="hover:text-blue-400 transition-colors cursor-pointer">DMCA Compliance</a>
              </li>
              <li>
                <a href="#cookies" className="hover:text-blue-400 transition-colors cursor-pointer">Cookie Settings</a>
              </li>
            </ul>
          </div>

          {/* Resources / Support Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#faq" className="hover:text-blue-400 transition-colors cursor-pointer">FAQ & Help</a>
              </li>
              <li>
                <a href="#support" className="hover:text-blue-400 transition-colors cursor-pointer">Developer Support</a>
              </li>
              <li>
                <a href="#roblox" className="hover:text-blue-400 transition-colors cursor-pointer">Roblox Guidelines</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition-colors cursor-pointer">Submit Contact Ticket</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line with contrast accent */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AssetsPP Portal. All rights reserved. Not affiliated with Roblox Corporation.
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Developer Cloud Hub Online</span>
          </div>
        </div>
      </footer>

      {/* 4. Bottom FIXED Navigation Core in Nike Premium Matte Style */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-2xl bg-[#090C15]/95 border border-gray-800 shadow-2xl flex items-center justify-between select-none">
        
        {/* Real content container */}
        <div className="relative z-10 bg-[#090C15]/95 backdrop-blur-md rounded-2xl py-2 px-4 flex items-center justify-between gap-6 pointer-events-auto font-sans">
          
          {/* Navigation Page COMPASS compass tab */}
          <button
            type="button"
            onClick={() => setActivePage('feed')}
            className={`px-3.5 py-2 text-xs font-sans font-bold flex items-center gap-1.5 uppercase transition-all duration-200 cursor-pointer rounded-xl ${
              activePage === 'feed'
                ? 'text-white bg-blue-600 border border-blue-500 px-4 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0 text-current" />
            <span>Feed</span>
          </button>

          {/* Dynamic Plus Core Button */}
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="w-10 h-10 rounded-full bg-[#10B981] hover:bg-[#34D399] text-black flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.45)]"
              title="Upload Roblox Asset"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Profile Page Tab */}
          <button
            type="button"
            onClick={() => setActivePage('profile')}
            className={`px-3.5 py-2 text-xs font-sans font-bold flex items-center gap-1.5 uppercase transition-all duration-200 cursor-pointer rounded-xl ${
              activePage === 'profile'
                ? 'text-white bg-blue-600 border border-blue-500 px-4 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Profile</span>
            <User className="w-4 h-4 shrink-0 text-current" />
          </button>

        </div>
      </div>

      {/* 5. OVERLAYS/MODALS PLACEMENTS */}

      {/* Upload Modal (Integrated Customizer on second tab) */}
      <AnimatePresence>
        {isUploadOpen && (
          <UploadAssetModal
            onAddAsset={handleAddAsset}
            onClose={() => setIsUploadOpen(false)}
            creatorUsername={user ? user.username : 'pavlemaster6'}
            creatorEmail={user ? user.email : 'pavlemaster6@gmail.com'}
          />
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setIsLoginOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Size up Detail Modal */}
      <AnimatePresence>
        {activeDetailAsset && (
          <AssetDetailModal
            asset={activeDetailAsset}
            onClose={() => setActiveDetailAsset(null)}
            liked={likedAssetsIds.includes(activeDetailAsset.id)}
            onLikeToggle={handleLikeToggle}
            onPurchaseSuccess={handlePurchaseSuccess}
          />
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <EditProfileModal
            profile={user || INITIAL_USER}
            onSaveProfile={handleApplyProfileEdit}
            onClose={() => setIsEditProfileOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
