"use client";

import Image from "next/image";
import { useState } from "react";

const UserMenu = () => {
  const [dropdown, setDropdown] = useState(false);

  const handleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={handleDropdown}
      className="flex h-10 w-30.25 items-center cursor-pointer"
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E2031]">
        <span className="text-[12px] font-medium text-white">MS</span>

        <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#070C1C] bg-[#E27E04]" />
      </div>

      <span className="ml-3 text-[14px] font-medium text-white">Meri</span>

      <Image
        src="/assets/images/user-profile/dropdown.svg"
        alt="dropdown"
        width={16}
        height={16}
        className={`ml-auto ${dropdown === false ? "rotate-0" : "rotate-180"}`}
      />
    </button>
  );
};

export default UserMenu;
