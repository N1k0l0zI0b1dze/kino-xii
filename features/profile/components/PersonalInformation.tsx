"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { User } from "@/features/auth/types";
import { getFilterOptions } from "@/lib/api/filterOptions";

import { updateProfile } from "../api/updateProfile";
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profileSchema";

type PersonalInformationProps = {
  user: User;
};

type Venue = {
  id: number;
  slug: string;
  name: string;
  city: string;
};

type ProfileApiError = {
  message?: string;
  errors?: Partial<Record<keyof ProfileFormValues, string[]>>;
};

const PersonalInformation = ({ user }: PersonalInformationProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",

    defaultValues: {
      fullName: user.fullName ?? "",
      mobileNumber: user.mobileNumber ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      preferredVenueId: user.preferredVenue?.id,
    },
  });

  const { data: filterOptions, isLoading: venuesLoading } = useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
  });

  const venues: Venue[] = filterOptions?.data.venues ?? [];

  const updateMutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },

    onError: (error: ProfileApiError) => {
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (!messages?.length) return;

          setError(field as keyof ProfileFormValues, {
            type: "server",
            message: messages[0],
          });
        });

        return;
      }

      setError("root.server", {
        type: "server",
        message: error.message ?? "Failed to update profile",
      });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    clearErrors("root.server");

    updateMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex h-auto w-220 flex-col gap-4.5"
    >
      <div>
        <label
          htmlFor="fullName"
          className={`text-sm font-medium ${
            errors.fullName ? "text-[#EC3013]" : "text-white"
          }`}
        >
          Full name
        </label>

        <div className="relative mt-2.5">
          <input
            id="fullName"
            type="text"
            placeholder="Enter full name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
            className={`h-10 w-full rounded-xl border bg-[#1E2031] px-4 text-sm text-white outline-none placeholder:text-[#A9A9A9] ${
              errors.fullName ? "border-[#EC3013]" : "border-[#505261]"
            }`}
          />
        </div>

        {errors.fullName && (
          <p className="mt-2 text-[12px] text-[#EC3013]">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-white">
          Email
        </label>

        <div className="relative mt-2.5">
          <input
            id="email"
            type="email"
            value={user.email}
            readOnly
            className="h-10 w-full rounded-xl border border-[#505261] bg-[#1E2031] px-4 text-sm text-[#A9A9A9] outline-none"
          />
        </div>

        <p className="mt-2 text-[12px] text-[#A9A9A9]">
          Set at registration and cannot be changed
        </p>
      </div>

      <div>
        <label
          htmlFor="mobileNumber"
          className={`text-sm font-medium ${
            errors.mobileNumber ? "text-[#EC3013]" : "text-white"
          }`}
        >
          Mobile number
        </label>

        <div className="relative mt-2.5">
          <input
            id="mobileNumber"
            type="tel"
            aria-invalid={!!errors.mobileNumber}
            {...register("mobileNumber")}
            className={`h-10 w-full rounded-xl border bg-[#1E2031] px-4 text-sm text-white outline-none ${
              errors.mobileNumber ? "border-[#EC3013]" : "border-[#505261]"
            }`}
          />
        </div>

        {errors.mobileNumber && (
          <p className="mt-2 text-[12px] text-[#EC3013]">
            {errors.mobileNumber.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="dateOfBirth"
          className={`text-sm font-medium ${
            errors.dateOfBirth ? "text-[#EC3013]" : "text-white"
          }`}
        >
          Date of birth
        </label>

        <div className="relative mt-2.5">
          <input
            id="dateOfBirth"
            type="date"
            aria-invalid={!!errors.dateOfBirth}
            {...register("dateOfBirth")}
            className={`h-10 w-full rounded-xl border bg-[#1E2031] px-4 text-sm text-white outline-none scheme-dark ${
              errors.dateOfBirth ? "border-[#EC3013]" : "border-[#505261]"
            }`}
          />
        </div>

        {errors.dateOfBirth && (
          <p className="mt-2 text-[12px] text-[#EC3013]">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="preferredVenueId"
          className="text-sm font-medium text-white"
        >
          Preferred venue
        </label>

        <div className="relative mt-2.5">
          <select
            id="preferredVenueId"
            {...register("preferredVenueId", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            className="h-10 w-full appearance-none rounded-xl border border-[#505261] bg-[#1E2031] px-4 pr-10 text-sm text-white outline-none"
          >
            <option value="">
              {venuesLoading ? "Loading venues..." : "Select preferred venue"}
            </option>

            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
            <Image
              src="/assets/images/user-profile/dropdown.svg"
              alt=""
              width={16}
              height={16}
            />
          </div>
        </div>
      </div>

      {errors.root?.server && (
        <p className="text-[12px] text-[#EC3013]">
          {errors.root.server.message}
        </p>
      )}

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="mt-4.5 h-10.25 w-35.25 rounded-full bg-[#EC3013] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {updateMutation.isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
};

export default PersonalInformation;
