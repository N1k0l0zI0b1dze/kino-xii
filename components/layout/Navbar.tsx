"use client";

import Image from "next/image";
import Link from "next/link";
import HeaderSearch from "@/features/search/components/HeaderSearch";
import AuthButtons from "@/features/auth/components/AuthButtons";
import UserMenu from "@/features/auth/components/UserMenu";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";

const Navbar = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user = data?.data;

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

      <HeaderSearch />

      {isLoading ? (
        <div className="h-10 w-48" />
      ) : user ? (
        <UserMenu user={user} />
      ) : (
        <AuthButtons />
      )}
    </nav>
  );
};

export default Navbar;
