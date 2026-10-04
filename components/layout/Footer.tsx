import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex h-20 w-full items-center justify-between border-t border-[#505261] bg-[#070C1C] px-15">
      <Image
        src="/assets/images/logo.svg"
        alt="Kino XII"
        width={56}
        height={14}
      />

      <p className="text-[12px] text-[#A9A9A9]">
        © 2026 Kino XII. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
