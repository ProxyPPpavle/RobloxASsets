/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CardStyles {
  bgColor: string;          // hex, e.g. #05070f or fallback
  bgImage: string;          // custom base64 image data from file, or empty
  textColor: string;        // general/fallback text color
  fontFamily: string;       // fallback font family
  frameStyle: string;       // frame style for card border effects
  gridEnabled: boolean;     // show grid pattern
  titleColor?: string;      // custom title text color hex
  descriptionColor?: string;// custom description text color hex
  titleFont?: string;       // custom title font family
  descriptionFont?: string; // custom description font family
  borderWidth?: number;     // custom border width / thickness
  borderColor?: string;     // custom border color hex
}

export interface Asset {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  fileUrl: string;
  fileName: string;
  gamepassLink: string;
  price: number;            // 0 if free, list price of robux R$ if not
  isFree: boolean;
  category: 'Model' | 'Map' | 'UI Pack';
  creatorUsername: string;
  creatorEmail: string;
  views: number;
  clicks: number;
  likes: number;
  createdAt: string;
  promoted: boolean;
  styles: CardStyles;
}

export interface Message {
  id: string;
  title: string;
  body: string;
  date: string;
  fileUrl?: string;         // direct download URL for purchased assets
  fileName?: string;        // purchased file name
  isRead: boolean;
  isSuccessPurchase: boolean;
}

export interface UserProfile {
  email: string;
  username: string;
  avatarUrl: string;
  memberSince: string;
  isAdmin: boolean;
  totalViews?: number;
  totalClicks?: number;
  estimatedEarnings?: number; // R$
}
