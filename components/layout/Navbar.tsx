"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const showSearchIcon = !isFocused || search.length > 0;
  return (
    <nav className="flex h-27.75 border-b items-center gap-4 px-15">
      <div className="flex shrink-0 items-center gap-9">
        <Link href="/" aria-label="Go to homepage">
          <Image
            src="/assets/images/logo.svg"
            alt="Kino XII Logo"
            width={88}
            height={22}
          />
        </Link>

        <Link
          href="#"
          className="text-[12px] font-normal tracking-[0.06em] text-[#FFFFFF]"
        >
          SESSIONS
        </Link>
      </div>

      <div className="ml-auto flex w-120 justify-end">
        <div className="flex h-10.25 w-95 items-center gap-2 rounded-full bg-white/10 px-3 transition-[width] duration-300 focus-within:w-full">
          {showSearchIcon && (
            <Image
              src="/assets/images/search/search.svg"
              alt=""
              width={14}
              height={14}
              className="shrink-0"
            />
          )}

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search films and live events..."
            className="w-full bg-transparent outline-none text-[14px] placeholder:text-[14px] placeholder:text-white"
          />

          {search.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full cursor-pointer"
            >
              <Image
                src="/assets/images/search/clear.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-4">
        <button className="w-24 h-10.25 rounded-full text-[14px] font-semibold text-white bg-[#EC3013]">
          Sign up
        </button>
        <button className="w-24 h-10.25 rounded-full text-[14px] font-bold text-black bg-white">
          Log in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
