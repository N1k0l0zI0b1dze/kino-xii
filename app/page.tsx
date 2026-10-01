"use client";

import { useQuery } from "@tanstack/react-query";
import { getFilterOptions } from "@/lib/api/filterOptions";

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
  });

  console.log(data);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error</p>;

  return <div>API connected</div>;
}
