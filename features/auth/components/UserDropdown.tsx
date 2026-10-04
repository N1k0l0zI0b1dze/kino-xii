"use client";

import Image from "next/image";
import Link from "next/link";
import type { User } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/logout";

type UserDropdownProps = {
  user: User;
  onClose: () => void;
};

const UserDropdown = ({ user, onClose }: UserDropdownProps) => {
  const displayName = user.fullName ?? user.username;

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,

    onSuccess: async () => {
      queryClient.setQueryData(["current-user"], null);

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },

    onError: (error) => {
      console.log("LOGOUT ERROR:", error);
    },
  });

  return (
    <div className="flex h-auto w-75.5 flex-col overflow-hidden rounded-2xl bg-[#070C1C]">
      <div className="flex h-15.5 w-full flex-row items-end gap-2.5 px-5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E2031]">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={displayName}
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

        <div className="flex flex-col">
          <p className="text-[14px] leading-none font-normal text-white">
            {displayName}
          </p>

          <p className="text-[12px] font-normal text-[#A9A9A9]">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 w-full px-5">
        {user.profileComplete ? (
          <div className="flex h-9 w-full items-center gap-1.5 rounded-[10px] bg-[#4ADE80]/10 px-3 py-2.5">
            <p className="text-[16px] text-[#4ADE80]">Profile Complete</p>

            <Image
              src="/assets/images/user-profile/profile-completed.svg"
              alt=""
              width={16}
              height={16}
            />
          </div>
        ) : (
          <div className="h-17.25 w-full rounded-[10px] bg-[#E27E04]/10 px-3 py-2.5">
            <p className="text-[16px] leading-none font-medium text-[#E27E04]">
              Profile incomplete
            </p>

            <p className="text-[12px] text-[#A9A9A9]">
              Please complete your profile to enable booking
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 w-full py-1">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex h-10 w-full items-center gap-2 px-5 transition-colors hover:bg-white/10"
        >
          <Image
            src="/assets/images/user-profile/profile.svg"
            alt=""
            width={16}
            height={16}
          />

          <span className="text-[14px] text-white">My Profile</span>
        </Link>

        <Link
          href="/profile?tab=tickets"
          onClick={onClose}
          className="flex h-10 w-full items-center gap-2 px-5 transition-colors hover:bg-white/10"
        >
          <Image
            src="/assets/images/user-profile/tickets.svg"
            alt=""
            width={16}
            height={16}
          />

          <span className="text-[14px] text-white">My Tickets</span>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="mt-1 mb-2.5 flex h-9 w-full items-center gap-2 px-5 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Image
          src="/assets/images/user-profile/logout.svg"
          alt=""
          width={16}
          height={16}
        />

        <span className="text-[14px] text-[#EC3013]">
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </span>
      </button>
    </div>
  );
};

export default UserDropdown;
