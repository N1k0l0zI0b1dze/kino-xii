import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/login";

type LoginModalProps = {
  onClose: () => void;
  onSignup: () => void;
};

const LoginModal = ({ onClose, onSignup }: LoginModalProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, touchedFields, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      onClose();
    },

    onError: (error) => {
      setError("root.server", {
        type: "server",
        message: error.message,
      });
    },
  });

  const emailIsValid = touchedFields.email && !errors.email;
  const passwordIsValid = touchedFields.password && !errors.password;

  const onSubmit = (data: LoginFormValues) => {
    clearErrors("root.server");
    loginMutation.mutate(data);
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex min-h-99.75 w-100.75 flex-col items-start rounded-[28px] bg-[#070C1C] px-8 py-8">
        <div className="flex w-full">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-extrabold text-white">Log in</h2>

            <p className="text-[12px] font-medium text-[#A9A9A9]">
              Welcome back to Kino XII
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
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
          <div className="flex flex-col">
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
                className={`h-10 w-full rounded-xl bg-[#1E2031] px-4 pr-10 text-sm text-white outline-none placeholder:text-[#A9A9A9] ${
                  errors.email
                    ? "border border-[#EC3013]"
                    : emailIsValid
                      ? "border border-[#4ADE80]"
                      : "border border-transparent"
                }`}
              />

              {emailIsValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4ADE80]">
                  ✓
                </span>
              )}

              {errors.email && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EC3013]">
                  !
                </span>
              )}
            </div>

            {errors.email && (
              <p className="mt-2 text-[12px] text-[#EC3013]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col">
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
                className={`h-10 w-full rounded-xl bg-[#1E2031] px-4 pr-10 text-sm text-white outline-none placeholder:text-[#A9A9A9] ${
                  errors.password
                    ? "border border-[#EC3013]"
                    : passwordIsValid
                      ? "border border-[#4ADE80]"
                      : "border border-transparent"
                }`}
              />

              {passwordIsValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4ADE80]">
                  ✓
                </span>
              )}

              {errors.password && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EC3013]">
                  !
                </span>
              )}
            </div>

            {errors.password && (
              <p className="mt-2 text-[12px] text-[#EC3013]">
                {errors.password.message}
              </p>
            )}

            {errors.root?.server && (
              <p className="mt-2 text-[12px] text-[#EC3013]">
                {errors.root.server.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || loginMutation.isPending}
            className={`mt-10 h-10.25 w-full rounded-full text-[14px] font-semibold transition-colors ${
              isValid && !loginMutation.isPending
                ? "cursor-pointer bg-[#EC3013] text-white"
                : "cursor-not-allowed bg-[#505261] text-[#A9A9A9]"
            }`}
          >
            {loginMutation.isPending ? "Logging in..." : "Log in"}
          </button>

          <p className="mt-4 text-center text-[14px] text-[#A9A9A9]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSignup}
              className="cursor-pointer font-medium text-[#EC3013]"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
