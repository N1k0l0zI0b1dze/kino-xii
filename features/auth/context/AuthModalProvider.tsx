"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

type AuthModal = "login" | "signup" | null;

type AuthModalContextValue = {
  openLogin: (afterLogin?: () => void) => void;
  openSignup: () => void;
  closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

type AuthModalProviderProps = {
  children: ReactNode;
};

export const AuthModalProvider = ({ children }: AuthModalProviderProps) => {
  const [authModal, setAuthModal] = useState<AuthModal>(null);

  const pendingActionRef = useRef<(() => void) | null>(null);

  const openLogin = (afterLogin?: () => void) => {
    pendingActionRef.current = afterLogin ?? null;
    setAuthModal("login");
  };

  const openSignup = () => {
    setAuthModal("signup");
  };

  const closeAuthModal = () => {
    pendingActionRef.current = null;
    setAuthModal(null);
  };

  const handleLoginSuccess = () => {
    const pendingAction = pendingActionRef.current;

    pendingActionRef.current = null;
    setAuthModal(null);

    pendingAction?.();
  };

  return (
    <AuthModalContext.Provider
      value={{
        openLogin,
        openSignup,
        closeAuthModal,
      }}
    >
      {children}

      {authModal === "login" && (
        <LoginModal
          onClose={closeAuthModal}
          onSignup={() => setAuthModal("signup")}
          onSuccess={handleLoginSuccess}
        />
      )}

      {authModal === "signup" && (
        <SignupModal
          onClose={closeAuthModal}
          onLogin={() => setAuthModal("login")}
        />
      )}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }

  return context;
};
