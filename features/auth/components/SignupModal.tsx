"use client";

import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "../schemas/signupSchema";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/register";

type SignupModalProps = {
  onClose: () => void;
  onLogin: () => void;
};

const SignupModal = ({ onClose, onLogin }: SignupModalProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, touchedFields, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("REGISTER SUCCESS:", data);
    },
    onError: (error) => {
      console.log("REGISTER ERROR:", error);
    },
  });

  const usernameIsValid = touchedFields.username && !errors.username;

  const emailIsValid = touchedFields.email && !errors.email;

  const passwordIsValid = touchedFields.password && !errors.password;

  const confirmPasswordIsValid =
    touchedFields.confirmPassword && !errors.confirmPassword;

  const password = watch("password");

  useEffect(() => {
    if (touchedFields.confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, touchedFields.confirmPassword, trigger]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Please upload JPG, PNG or WEBP");
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }

    setAvatarError("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: SignupFormValues) => {
    registerMutation.mutate({
      ...data,
      avatar: avatarFile,
    });
  };

  const inputStateClasses = (
    hasError: boolean,
    isFieldValid: boolean | undefined,
  ) => {
    if (hasError) {
      return "border border-[#EC3013]";
    }

    if (isFieldValid) {
      return "border border-[#4ADE80]";
    }

    return "border border-transparent";
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex min-h-139.5 w-118.75 flex-col items-start rounded-[28px] bg-[#070C1C] px-8 py-8">
        {/* Header */}
        <div className="flex w-full">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-extrabold text-white">Sign up</h2>

            <p className="text-[12px] font-medium text-[#A9A9A9]">
              Welcome to Kino XII
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close signup modal"
            className="ml-auto flex h-6 w-6 cursor-pointer items-center justify-center"
          >
            <Image
              src="/assets/images/login/close-modal.svg"
              alt=""
              width={12}
              height={12}
            />
          </button>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col"
        >
          {/* Avatar */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1E2031]">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/assets/images/signup/upload.svg"
                  alt=""
                  width={12}
                  height={11}
                />
              )}
            </div>

            <div>
              <p className="text-[14px] font-semibold text-white">
                Upload avatar (optional)
              </p>

              <p
                className={`text-[12px] ${
                  avatarError ? "text-[#EC3013]" : "text-[#A9A9A9]"
                }`}
              >
                {avatarError || "JPG, PNG or WEBP"}
              </p>
            </div>
          </label>

          {/* Username */}
          <div className="mt-6 flex flex-col">
            <label
              htmlFor="username"
              className={`text-sm font-medium ${
                errors.username ? "text-[#EC3013]" : "text-white"
              }`}
            >
              Username
            </label>

            <div className="relative mt-2.5">
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                aria-invalid={!!errors.username}
                {...register("username")}
                className={`h-10 w-full rounded-xl bg-[#1E2031] px-4 pr-10 text-sm text-white outline-none placeholder:text-[#A9A9A9] ${inputStateClasses(
                  !!errors.username,
                  usernameIsValid,
                )}`}
              />

              {usernameIsValid && (
                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#4ADE80]">
                  ✓
                </span>
              )}
            </div>

            {errors.username && (
              <p className="mt-2 text-[12px] text-[#EC3013]">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="email"
              className={`text-sm font-medium ${
                errors.email ? "text-[#EC3013]" : "text-white"
              }`}
            >
              Email
            </label>

            <div className="relative mt-2.5">
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                aria-invalid={!!errors.email}
                {...register("email")}
                className={`h-10 w-full rounded-xl bg-[#1E2031] px-4 pr-10 text-sm text-white outline-none placeholder:text-[#A9A9A9] ${inputStateClasses(
                  !!errors.email,
                  emailIsValid,
                )}`}
              />

              {emailIsValid && (
                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#4ADE80]">
                  ✓
                </span>
              )}
            </div>

            {errors.email && (
              <p className="mt-2 text-[12px] text-[#EC3013]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Passwords */}
          <div className="mt-6 flex w-full gap-3">
            <div className="flex flex-1 flex-col">
              <label
                htmlFor="password"
                className={`text-sm font-medium ${
                  errors.password ? "text-[#EC3013]" : "text-white"
                }`}
              >
                Password
              </label>

              <div className="relative mt-2.5">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className={`h-10 w-full rounded-xl bg-[#1E2031] px-4 pr-10 text-sm text-white outline-none placeholder:text-[#A9A9A9] ${inputStateClasses(
                    !!errors.password,
                    passwordIsValid,
                  )}`}
                />

                {passwordIsValid && (
                  <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#4ADE80]">
                    ✓
                  </span>
                )}
              </div>

              {errors.password && (
                <p className="mt-2 text-[12px] text-[#EC3013]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <label
                htmlFor="password-conf"
                className={`text-sm font-medium ${
                  errors.confirmPassword ? "text-[#EC3013]" : "text-white"
                }`}
              >
                Confirm Password
              </label>

              <div className="relative mt-2.5">
                <input
                  id="password-conf"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                  className={`h-10 w-full rounded-xl bg-[#1E2031] px-4 pr-10 text-sm text-white outline-none placeholder:text-[#A9A9A9] ${inputStateClasses(
                    !!errors.confirmPassword,
                    confirmPasswordIsValid,
                  )}`}
                />

                {confirmPasswordIsValid && (
                  <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#4ADE80]">
                    ✓
                  </span>
                )}
              </div>

              {errors.confirmPassword && (
                <p className="mt-2 text-[12px] text-[#EC3013]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || !!avatarError}
            className={`mt-6 h-10.25 w-full rounded-full text-[14px] font-semibold transition-colors ${
              isValid && !avatarError
                ? "cursor-pointer bg-[#EC3013] text-white"
                : "cursor-not-allowed bg-[#505261] text-[#A9A9A9]"
            }`}
          >
            Sign up
          </button>

          {/* Switch to login */}
          <p className="mt-4 text-center text-[14px] text-[#A9A9A9]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLogin}
              className="cursor-pointer font-medium text-[#EC3013]"
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </Modal>
  );
};

export default SignupModal;
