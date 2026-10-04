"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";

const ProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user = data?.data;

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
    <main className="min-h-screen bg-[#070707] text-white">
      <h1>My Profile</h1>

      <p>{user.fullName ?? user.username}</p>
      <p>{user.email}</p>
    </main>
  );
};

export default ProfilePage;
