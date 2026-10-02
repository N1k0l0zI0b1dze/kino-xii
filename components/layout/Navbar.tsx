import Image from "next/image";
import Link from "next/link";
import HeaderSearch from "@/features/search/components/HeaderSearch";
import AuthButtons from "@/features/auth/components/AuthButtons";
import UserMenu from "@/features/auth/components/UserMenu";

const Navbar = () => {
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
      {/* <AuthButtons /> */}
      <UserMenu />
    </nav>
  );
};

export default Navbar;
