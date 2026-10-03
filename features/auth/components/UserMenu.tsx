"use client";

import Image from "next/image";
import { useState } from "react";
import UserDropdown from "./UserDropdown";
import type { User } from "../types";

type UserMenuProps = {
  user: User;
};

const UserMenu = ({ user }: UserMenuProps) => {
  const [dropdown, setDropdown] = useState(false);

  const handleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const firstName = user.name.split(" ")[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDropdown}
        className="flex h-10 w-30.25 cursor-pointer items-center"
      >
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E2031]">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <span className="text-[12px] font-medium text-white">
              {initials}
            </span>
          )}

          <div
            className={`absolute right-0 bottom-0 h-2 w-2 rounded-full border border-[#070C1C] ${
              user.profileComplete ? "bg-[#4ADE80]" : "bg-[#E27E04]"
            }`}
          />
        </div>

        <span className="ml-3 text-[14px] font-medium text-white">
          {firstName}
        </span>

        <Image
          src="/assets/images/user-profile/dropdown.svg"
          alt=""
          width={16}
          height={16}
          className={`ml-auto transition-transform duration-200 ${
            dropdown ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {dropdown && (
        <div className="absolute top-full right-0 mt-2">
          <UserDropdown user={user} />
        </div>
      )}
    </div>
  );
};

export default UserMenu;
