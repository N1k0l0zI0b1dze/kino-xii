import Image from "next/image";
import Link from "next/link";

const UserDropdown = () => {
  return (
    <div className="flex h-auto w-75.5 flex-col overflow-hidden rounded-2xl bg-[#070C1C]">
      <div className="flex h-15.5 w-full flex-row items-end gap-2.5 px-5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E2031]">
          <span className="text-[12px] font-medium text-white">MS</span>

          <div className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-[#070C1C] bg-[#E27E04]" />
        </div>

        <div className="flex flex-col">
          <p className="text-[14px] leading-none font-normal text-white">
            Meri Sanikidze
          </p>

          <p className="text-[12px] font-normal text-[#A9A9A9]">
            merisanikidze@gmail.com
          </p>
        </div>
      </div>

      <div className="mt-4 w-full px-5">
        <div className="h-17.25 w-full rounded-[10px] bg-[#E27E04]/10 px-3 py-2.5">
          <p className="text-[16px] leading-none font-medium text-[#E27E04]">
            Profile incomplete
          </p>

          <p className="text-[12px] text-[#A9A9A9]">
            Please complete your profile to enable booking
          </p>
        </div>
      </div>

      <div className="mt-2 w-full py-1">
        <Link
          href="/profile"
          className="flex h-10 w-full items-center gap-2 px-5 transition-colors hover:bg-white/10"
        >
          <Image
            src="/assets/images/user-profile/profile.svg"
            alt="profile-icon"
            width={16}
            height={16}
          />

          <span className="text-[14px] text-white">My Profile</span>
        </Link>

        <Link
          href="/profile?tab=tickets"
          className="flex h-10 w-full items-center gap-2 px-5 transition-colors hover:bg-white/10"
        >
          <Image
            src="/assets/images/user-profile/tickets.svg"
            alt="tickets"
            width={16}
            height={16}
          />

          <span className="text-[14px] text-white">My Tickets</span>
        </Link>
      </div>

      <button className="flex items-center h-9 px-5 gap-2 mt-1 mb-2.5  transition-colors hover:bg-white/10">
        <Image
          src="/assets/images/user-profile/logout.svg"
          alt="logout"
          width={16}
          height={16}
        />
        <span className="text-[14px] text-[#EC3013]">Log out</span>
      </button>
    </div>
  );
};

export default UserDropdown;
