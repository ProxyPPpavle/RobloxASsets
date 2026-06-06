/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Asset, Message, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  email: 'pavlemaster6@gmail.com',
  username: 'pavlemaster6',
  avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  memberSince: '5/29/2026',
  isAdmin: true,
  totalViews: 1420,
  totalClicks: 385,
  estimatedEarnings: 15400, // R$
};

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    title: '🎉 Asset Sale Complete!',
    body: 'Someone purchased your "Advanced Combat System V2" asset pack. R$ 450 has been credited to your account.',
    date: '2026-05-29 18:32',
    isRead: false,
    isSuccessPurchase: false
  },
  {
    id: 'msg-2',
    title: '🤝 Purchased Asset: Cinematic Lighting Profile',
    body: 'Your order has been compiled successfully. You can download the completed .rbxm file below, drag and drop it directly into your Roblox Studio to load the cinematic atmosphere.',
    date: '2026-05-28 12:10',
    fileUrl: '#download-lighting-pack.rbxm',
    fileName: 'Cinematic_Lighting_Profiles.rbxm',
    isRead: true,
    isSuccessPurchase: true
  },
  {
    id: 'msg-3',
    title: '⚡ Promotion Approved!',
    body: 'Your live-promoting bid for "Realistic Rain Shader" has been initialized. Clicks on your card will now feature prioritized positioning across global asset feeds.',
    date: '2026-05-27 09:15',
    isRead: true,
    isSuccessPurchase: false
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'asset-1',
    title: 'Epic Radiant Sword Pack',
    description: 'Fully custom animations, visual effects, trailing lights, and damage registering hitbox logic built in standard Roblox Lua (Luau). Includes 5 distinct sword variations (Radiant, Doom, Frost, Volt, Abyss) with glowing particles.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    fileUrl: '#epic_radiant_swords.rbxm',
    fileName: 'Epic_Radiant_Swords.rbxm',
    gamepassLink: 'https://roblox.com/game-pass/12345678',
    price: 350,
    isFree: false,
    category: 'Model',
    creatorUsername: 'blockbuilder_pro',
    creatorEmail: 'blockbuilder@gmail.com',
    views: 452,
    clicks: 120,
    likes: 42,
    createdAt: '2026-05-29',
    promoted: true,
    styles: {
      bgColor: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      bgImage: '',
      textColor: '#ffffff',
      fontFamily: 'font-display',
      frameStyle: 'frame-neon-green',
      gridEnabled: true
    }
  },
  {
    id: 'asset-2',
    title: 'Advanced Combat Architecture',
    description: 'Ultra responsive hitboxes (Raycast-based), stun timers, block mechanics, dynamic ragdoll death, and camera shake module. Easy custom weapon registry.',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    fileUrl: '#adv_combat_system.rbxm',
    fileName: 'Advanced_Combat_System.rbxm',
    gamepassLink: '',
    price: 0,
    isFree: true,
    category: 'Model',
    creatorUsername: 'luau_wizard',
    creatorEmail: 'magic@yahoo.com',
    views: 890,
    clicks: 341,
    likes: 129,
    createdAt: '2026-05-28',
    promoted: false,
    styles: {
      bgColor: '#05070f',
      bgImage: '',
      textColor: '#4ade80',
      fontFamily: 'font-mono',
      frameStyle: 'frame-cosmic-blue',
      gridEnabled: true
    }
  },
  {
    id: 'asset-3',
    title: 'Cyberpunk District Neo-8',
    description: 'Highly detailed futuristic neon cyberpunk environment. Prefab modular buildings, neon light poles, custom cyber-cars models, dynamic rain-slicked asphalt streets, and atmospheric neon fog settings.',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    fileUrl: '#cyberpunk_district_neo8.rbxm',
    fileName: 'Cyberpunk_District_Neo8.rbxm',
    gamepassLink: 'https://roblox.com/game-pass/87654321',
    price: 1200,
    isFree: false,
    category: 'Map',
    creatorUsername: 'pavlemaster6',
    creatorEmail: 'pavlemaster6@gmail.com',
    views: 2045,
    clicks: 812,
    likes: 310,
    createdAt: '2026-05-27',
    promoted: true,
    styles: {
      bgColor: 'linear-gradient(135deg, #090514 0%, #2e0854 100%)',
      bgImage: '',
      textColor: '#ec4899',
      fontFamily: 'font-display',
      frameStyle: 'frame-golden-sparkle',
      gridEnabled: false
    }
  },
  {
    id: 'asset-4',
    title: 'Clean Minimalist UI Hub',
    description: 'Fully responsive shop container, profile info tab, redeemable codes frame, custom healthbar overlay, and modern settings menu. Fully animated with TweenService in Roblox Studio.',
    thumbnail: 'https://images.unsplash.com/photo-1541462608141-2f5233b8a3e1?w=600&auto=format&fit=crop&q=80',
    fileUrl: '#minimalist_ui_hub.rbxm',
    fileName: 'Minimalist_UI_Hub.rbxm',
    gamepassLink: '',
    price: 0,
    isFree: true,
    category: 'UI Pack',
    creatorUsername: 'design_god',
    creatorEmail: 'pavlemaster6@gmail.com',
    views: 129,
    clicks: 44,
    likes: 18,
    createdAt: '2026-05-29',
    promoted: false,
    styles: {
      bgColor: '#020617',
      bgImage: '',
      textColor: '#3b82f6',
      fontFamily: 'font-sans',
      frameStyle: 'frame-fiery-red',
      gridEnabled: true
    }
  }
];
