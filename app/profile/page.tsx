"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import PersonalInformation from "@/features/profile/components/PersonalInformation";
import MyTickets from "@/features/profile/components/MyTickets";
import { getTickets } from "@/features/profile/api/getTickets";

const ProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user = data?.data;

  const { data: ticketsData } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
    enabled: !!user,
    retry: false,
  });

  const ticketCount = ticketsData?.data.length ?? 0;

  const activeTab =
    searchParams.get("tab") === "tickets" ? "tickets" : "personal";

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#070707] text-white">Loading...</main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#070707] text-white">
        You are not authenticated.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070C1C] px-12.75 text-white">
      <div className="mt-[6.5px] flex h-22 flex-col items-start gap-7">
        <h1 className="text-[24px] font-semibold text-white">My Profile</h1>

        <div className="flex flex-row gap-8">
          <button
            type="button"
            onClick={() => router.replace("/profile", { scroll: false })}
            className={`pb-3.5 text-[14px] font-medium ${
              activeTab === "personal" ? "border-b-2 border-b-[#EC3013]" : ""
            }`}
          >
            Personal Information
          </button>

          <button
            type="button"
            onClick={() =>
              router.replace("/profile?tab=tickets", { scroll: false })
            }
            className={`pb-3.5 text-[14px] font-medium ${
              activeTab === "tickets" ? "border-b-2 border-b-[#EC3013]" : ""
            }`}
          >
            My Tickets
            <span className="ml-2 inline-flex h-4.25 w-4.75 items-center justify-center rounded-full bg-[#EC3013] text-[12px]">
              {ticketCount}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-10.5">
        {activeTab === "personal" ? (
          <PersonalInformation user={user} />
        ) : (
          <MyTickets />
        )}
      </div>
    </main>
  );
};

const ProfilePage = () => {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#070707] text-white">Loading...</main>
      }
    >
      <ProfileContent />
    </Suspense>
  );
};

export default ProfilePage;
