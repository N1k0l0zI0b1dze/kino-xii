"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getFilterOptions } from "@/features/booking/api/getFilterOptions";
import { getNextSevenDays } from "../utils/getNextSevenDays";

const SessionsFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
  });

  const selectedVenues = searchParams.getAll("venues[]");
  const selectedDate = searchParams.get("date");
  const selectedFormats = searchParams.getAll("formats[]");
  const selectedLanguages = searchParams.getAll("languages[]");
  const selectedTimes = searchParams.getAll("bands[]");

  const activeFiltersCount =
    selectedVenues.length +
    (selectedDate ? 1 : 0) +
    selectedFormats.length +
    selectedLanguages.length +
    selectedTimes.length;

  const updateParams = (params: URLSearchParams) => {
    params.set("page", "1");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleArrayFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(key);

    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    params.delete(key);

    nextValues.forEach((item) => {
      params.append(key, item);
    });

    updateParams(params);
  };

  const handleDate = (dateId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedDate === dateId) {
      params.delete("date");
    } else {
      params.set("date", dateId);
    }

    updateParams(params);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("venues[]");
    params.delete("date");
    params.delete("formats[]");
    params.delete("languages[]");
    params.delete("bands[]");

    updateParams(params);
  };

  if (isLoading) {
    return null;
  }

  if (error || !data) {
    return null;
  }

  const { venues, formats, languages, timeBands } = data.data;

  const handleVenue = (venueSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentVenues = params.getAll("venues[]");

    const nextVenues = currentVenues.includes(venueSlug)
      ? currentVenues.filter((slug) => slug !== venueSlug)
      : [...currentVenues, venueSlug];

    params.delete("venues[]");

    nextVenues.forEach((slug) => {
      params.append("venues[]", slug);
    });

    if (nextVenues.length > 0) {
      const availableFormatSlugs = new Set(
        venues
          .filter((venue) => nextVenues.includes(venue.slug))
          .flatMap((venue) => venue.formats.map((format) => format.slug)),
      );

      const currentFormats = params.getAll("formats[]");

      params.delete("formats[]");

      currentFormats
        .filter((formatSlug) => availableFormatSlugs.has(formatSlug))
        .forEach((formatSlug) => {
          params.append("formats[]", formatSlug);
        });
    }

    updateParams(params);
  };

  const availableFormats =
    selectedVenues.length === 0
      ? formats
      : formats.filter((format) =>
          venues.some(
            (venue) =>
              selectedVenues.includes(venue.slug) &&
              venue.formats.some(
                (venueFormat) => venueFormat.slug === format.slug,
              ),
          ),
        );

  const dates = getNextSevenDays();

  return (
    <div className="h-auto w-[320px] rounded-2xl bg-[#1E2031] px-6 py-6">
      <div className="flex flex-col">
        <h3 className="text-[18px] font-bold text-white">Filters</h3>

        <div className="mt-6 flex flex-col gap-3 border-b border-b-[#2A2C3D] pb-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">VENUE</p>

          <ul className="flex flex-col gap-3">
            {venues.map((venue) => (
              <li key={venue.id} className="flex flex-row items-center gap-2.5">
                <div
                  onClick={() => handleVenue(venue.slug)}
                  className={`flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-[5px] border-2 border-[#505261] ${
                    selectedVenues.includes(venue.slug) && "bg-[#EC3013]"
                  }`}
                >
                  {selectedVenues.includes(venue.slug) && (
                    <Image
                      src="/assets/images/sessions/selected.svg"
                      alt="selected"
                      width={9.51}
                      height={7.12}
                    />
                  )}
                </div>

                <p className="text-sm font-medium text-white">
                  {venue.name} ·{" "}
                  <span className="text-[12px] font-medium text-[#A9A9A9]">
                    {venue.city}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-b border-b-[#2A2C3D] pb-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">DATE</p>

          <ul className="scrollbar-none flex flex-row gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {dates.map((date) => (
              <li
                key={date.id}
                onClick={() => handleDate(date.id)}
                className={`flex h-13.5 w-9.25 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg bg-[#2A2C3D] ${
                  selectedDate === date.id && "bg-[#EC3013]"
                }`}
              >
                <p className="text-[12px] font-medium text-white">{date.day}</p>
                <p className="text-[12px] font-medium text-white">
                  {date.date}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-b border-b-[#2A2C3D] pb-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">FORMAT</p>

          <ul className="flex flex-col gap-3">
            {availableFormats.map((format) => (
              <li
                key={format.id}
                className="flex flex-row items-center gap-2.5"
              >
                <div
                  onClick={() => handleArrayFilter("formats[]", format.slug)}
                  className={`flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-[5px] border-2 border-[#505261] ${
                    selectedFormats.includes(format.slug) && "bg-[#EC3013]"
                  }`}
                >
                  {selectedFormats.includes(format.slug) && (
                    <Image
                      src="/assets/images/sessions/selected.svg"
                      alt="selected"
                      width={9.51}
                      height={7.12}
                    />
                  )}
                </div>

                <p className="text-sm font-medium text-white">{format.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-b border-b-[#2A2C3D] pb-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">LANGUAGE</p>

          <ul className="flex flex-col gap-3">
            {languages.map((language) => (
              <li
                key={language.id}
                className="flex flex-row items-center gap-2.5"
              >
                <div
                  onClick={() =>
                    handleArrayFilter("languages[]", language.slug)
                  }
                  className={`flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-[5px] border-2 border-[#505261] ${
                    selectedLanguages.includes(language.slug) && "bg-[#EC3013]"
                  }`}
                >
                  {selectedLanguages.includes(language.slug) && (
                    <Image
                      src="/assets/images/sessions/selected.svg"
                      alt="selected"
                      width={9.51}
                      height={7.12}
                    />
                  )}
                </div>

                <p className="text-sm font-medium text-white">
                  {language.name}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 pb-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">TIME OF DAY</p>

          <ul className="flex flex-col gap-3">
            {timeBands.map((time) => (
              <li key={time.id} className="flex flex-row items-center gap-2.5">
                <div
                  onClick={() => handleArrayFilter("bands[]", time.id)}
                  className={`flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-[5px] border-2 border-[#505261] ${
                    selectedTimes.includes(time.id) && "bg-[#EC3013]"
                  }`}
                >
                  {selectedTimes.includes(time.id) && (
                    <Image
                      src="/assets/images/sessions/selected.svg"
                      alt="selected"
                      width={9.51}
                      height={7.12}
                    />
                  )}
                </div>

                <p className="text-sm font-medium text-white">{time.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-t-[#2A2C3D] pt-6">
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="h-9 w-full cursor-pointer rounded-full border border-[#A9A9A9] text-sm font-medium text-white"
            >
              Clear filters
            </button>
          )}

          <p className="text-sm font-medium text-[#A9A9A9]">
            {activeFiltersCount}{" "}
            {activeFiltersCount === 1 ? "filter" : "filters"} active
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionsFilters;
