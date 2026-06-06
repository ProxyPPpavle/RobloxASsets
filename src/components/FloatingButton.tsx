"use client";
import { useState } from "react";
import UploadModal from "./UploadModal";

export default function FloatingButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#2ea043] hover:bg-[#3fb950] rounded-full flex items-center justify-center text-white text-4xl font-light shadow-[0_0_20px_rgba(46,160,67,0.5)] transition-transform hover:scale-110 hover:-translate-y-2 z-40 border-4 border-[#0b0f1a]"
      >
        +
      </button>

      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
