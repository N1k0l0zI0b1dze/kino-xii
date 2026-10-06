import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex flex-col h-24.5 w-full bg-[#070C1C] px-15">
      <div className="w-full h-px bg-[#2A2C3D] mt-6.75"></div>

      <div className="flex items-center justify-between mt-5">
        <Image
          src="/assets/images/logo.svg"
          alt="Kino XII"
          width={56}
          height={14}
        />

        <p className="text-[12px] text-[#A9A9A9]">
          © 2026 Kino XII. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
