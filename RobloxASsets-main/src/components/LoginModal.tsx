/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ShieldCheck, ArrowRight, Sparkles, X, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  onLoginSuccess: (user: UserProfile) => void;
  onClose: () => void;
  showBypassButton?: boolean;
}

export default function LoginModal({ onLoginSuccess, onClose, showBypassButton = true }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isSending, setIsSending] = useState(false);
  const [errorError, setErrorError] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorError('Please enter a valid email address.');
      return;
    }
    setErrorError('');
    setIsSending(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
      setTimer(30);
    }, 1200);
  };

  const handleOtpInput = (index: number, val: string) => {
    if (isNaN(Number(val)) && val !== '') return;
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otpCode[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = otpCode.join('');
    if (finalCode.length < 6) {
      setErrorError('Please enter all 6 digits.');
      return;
    }
    setErrorError('');

    const mockUser: UserProfile = {
      email: email,
      username: email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email.split('@')[0]}`,
      memberSince: new Date().toLocaleDateString('en-US'),
      isAdmin: email.toLowerCase().includes('admin') || email === 'pavlemaster6@gmail.com',
      totalViews: 0,
      totalClicks: 0,
      estimatedEarnings: 0
    };

    onLoginSuccess(mockUser);
  };

  const handleBypass = () => {
    const defaultDemo: UserProfile = {
      email: 'pavlemaster6@gmail.com',
      username: 'pavlemaster6',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      memberSince: '5/29/2026',
      isAdmin: true,
      totalViews: 1420,
      totalClicks: 385,
      estimatedEarnings: 15400
    };
    onLoginSuccess(defaultDemo);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setOtpCode(['', '', '', '', '', '']);
    setTimer(30);
    setTimeout(() => {
      document.getElementById('otp-0')?.focus();
    }, 100);
  };

  return (
    <div id="login-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        id="login-modal-content"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-md bg-[#0F111A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative text-gray-200"
      >
        <div className="p-6 bg-[#0A0B10] border-b border-white/5 flex flex-col items-center text-center relative overflow-hidden">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 bg-white/5 text-white rounded-xl flex items-center justify-center mb-3 border border-white/5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          
          <h2 className="text-xl font-display font-bold tracking-tight text-white">
            AssetsPP
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSendEmail}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-xs font-mono text-gray-400 tracking-wide uppercase">Email Address</label>
                  <div className="relative">
                    <input 
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="gmail.com"
                      className="w-full bg-[#07080e] border border-white/5 focus:border-white rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
                      required
                    />
                    <Mail className="absolute left-3.5 top-3 text-gray-500 w-4.5 h-4.5 pointer-events-none" />
                  </div>
                </div>

                {errorError && (
                  <p className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-lg">
                    {errorError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-blue-600 border border-blue-500 hover:bg-blue-700 text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-55 text-sm shadow-[0_4px_15px_rgba(37,99,235,0.35)]"
                >
                  {isSending ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending Code...
                    </span>
                  ) : (
                    <>
                      Receive Login Token
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleConfirmOtp}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-450">A 6-digit access token has been sent to:</p>
                  <p className="text-xs font-mono font-semibold text-white break-all">{email}</p>
                </div>

                <div className="flex justify-between gap-2 max-w-xs mx-auto">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-10 h-10 bg-[#07080e] text-center text-md font-bold font-mono text-white border border-white/5 focus:border-white rounded-lg outline-none transition-all"
                    />
                  ))}
                </div>

                {errorError && (
                  <p className="text-xs text-rose-455 bg-rose-955/20 border border-rose-900/30 p-2.5 rounded-lg text-center">
                    {errorError}
                  </p>
                )}

                <div className="text-center text-xs">
                  {timer > 0 ? (
                    <span className="text-gray-550">
                      Request new code in <strong className="text-white font-mono">{timer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-white hover:underline transition-all cursor-pointer font-medium"
                    >
                      Resend dynamic token
                    </button>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtpCode(['', '', '', '', '', '']);
                      setErrorError('');
                    }}
                    className="w-1/3 border border-white/5 hover:bg-white/5 text-gray-300 rounded-xl py-2.5 text-xs transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 border border-blue-500 hover:bg-blue-700 text-white rounded-xl py-2.5 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-[0_4px_15px_rgba(37,99,235,0.35)]"
                  >
                    Authorize Session
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {showBypassButton && (
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
              <span className="text-xs text-gray-500">Want to run simulation instant login?</span>
              <button
                type="button"
                onClick={handleBypass}
                className="mt-2 w-full flex items-center justify-center gap-1 py-2 px-3 bg-white/5 border border-dashed border-white/10 hover:border-white hover:bg-white/10 text-xs font-sans font-medium text-gray-400 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-yellow-500" />
                Authenticate as Pavle
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
