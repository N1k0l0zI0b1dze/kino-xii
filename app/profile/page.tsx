"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { useRouter, useSearchParams } from "next/navigation";
import PersonalInformation from "@/features/profile/components/PersonalInformation";
import MyTickets from "@/features/profile/components/MyTickets";

const ProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user = data?.data;
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <main className="min-h-screen bg-[#070C1C] text-white px-12.75">
      <div className="flex flex-col h-22 items-start mt-[6.5px] gap-7">
        <h1 className="text-[24px] font-semibold text-white">My Profile</h1>

        <div className="flex flex-row gap-8">
          <button
            onClick={() => router.replace("/profile", { scroll: false })}
            className={`pb-3.5 text-[14px] font-medium ${
              activeTab === "personal" ? "border-b-2 border-b-[#EC3013]" : ""
            }`}
          >
            Personal Information
          </button>

          <button
            onClick={() =>
              router.replace("/profile?tab=tickets", { scroll: false })
            }
            className={`pb-3.5 text-[14px] font-medium ${
              activeTab === "tickets" ? "border-b-2 border-b-[#EC3013]" : ""
            }`}
          >
            My Tickets
            <span className="ml-2 inline-flex h-4.25 w-4.75 items-center justify-center rounded-full bg-[#EC3013] text-[12px]">
              2
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

export default ProfilePage;
