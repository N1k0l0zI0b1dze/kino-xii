"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const AuthButtons = () => {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  return (
    <>
      <div className="flex shrink-0 gap-4">
        <button
          type="button"
          onClick={() => setAuthModal("signup")}
          className="h-10.25 w-24 rounded-full bg-[#EC3013] text-[14px] font-semibold text-white"
        >
          Sign up
        </button>

        <button
          type="button"
          onClick={() => setAuthModal("login")}
          className="h-10.25 w-24 rounded-full bg-white text-[14px] font-bold text-black"
        >
          Log in
        </button>
      </div>

      {authModal === "login" && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onSignup={() => setAuthModal("signup")}
        />
      )}

      {authModal === "signup" && (
        <SignupModal
          onClose={() => setAuthModal(null)}
          onLogin={() => setAuthModal("login")}
        />
      )}
    </>
  );
};

export default AuthButtons;
