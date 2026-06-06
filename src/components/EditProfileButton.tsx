"use client";

import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function EditProfileButton({ currentUsername }: { currentUsername: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="ml-auto mt-4 md:mt-0 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] hover:text-white rounded-lg text-sm font-bold transition-colors"
      >
        Edit Profile
      </button>

      {isOpen && (
        <EditProfileModal 
          currentUsername={currentUsername} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
