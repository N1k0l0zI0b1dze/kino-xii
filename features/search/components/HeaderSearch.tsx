"use client";
import Image from "next/image";
import { useState } from "react";

const HeaderSearch = () => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const showSearchIcon = !isFocused || search.length > 0;
  return (
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
  );
};

export default HeaderSearch;
