"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getFilterOptions } from "@/features/booking/api/getFilterOptions";
import { getNextSevenDays } from "../utils/getNextSevenDays";

const SessionsFilters = () => {
  const [selectedVenues, setSelectedVenues] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<number[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
  });

  const activeFiltersCount =
    selectedVenues.length +
    (selectedDate ? 1 : 0) +
    selectedFormats.length +
    selectedLanguages.length +
    selectedTimes.length;

  const handleDate = (dateId: string) => {
    setSelectedDate((prev) => (prev === dateId ? null : dateId));
  };

  const handleFormat = (formatId: number) => {
    setSelectedFormats((prev) =>
      prev.includes(formatId)
        ? prev.filter((id) => id !== formatId)
        : [...prev, formatId],
    );
  };

  const handleLanguage = (languageId: number) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId)
        : [...prev, languageId],
    );
  };

  const handleTimeOfDay = (timeId: string) => {
    setSelectedTimes((prev) =>
      prev.includes(timeId)
        ? prev.filter((id) => id !== timeId)
        : [...prev, timeId],
    );
  };

  const handleClearFilters = () => {
    setSelectedVenues([]);
    setSelectedDate(null);
    setSelectedFormats([]);
    setSelectedLanguages([]);
    setSelectedTimes([]);
  };

  if (isLoading) {
    return null;
  }

  if (error || !data) {
    return null;
  }

  const { venues, formats, languages, timeBands } = data.data;

  const handleFilter = (venueId: number) => {
    const nextVenues = selectedVenues.includes(venueId)
      ? selectedVenues.filter((id) => id !== venueId)
      : [...selectedVenues, venueId];

    setSelectedVenues(nextVenues);

    if (nextVenues.length === 0) return;

    const availableFormatIds = new Set(
      venues
        .filter((venue) => nextVenues.includes(venue.id))
        .flatMap((venue) => venue.formats.map((format) => format.id)),
    );

    setSelectedFormats((prev) =>
      prev.filter((formatId) => availableFormatIds.has(formatId)),
    );
  };
  const availableFormats =
    selectedVenues.length === 0
      ? formats
      : formats.filter((format) =>
          venues.some(
            (venue) =>
              selectedVenues.includes(venue.id) &&
              venue.formats.some((venueFormat) => venueFormat.id === format.id),
          ),
        );

  const dates = getNextSevenDays();

  return (
    <div className="w-[320px] h-auto rounded-2xl bg-[#1E2031] px-6 py-6">
      <div className="flex flex-col">
        <h3 className="text-[18px] font-bold text-white">Filters</h3>

        <div className="flex flex-col gap-3 pb-6 border-b border-b-[#2A2C3D] mt-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">VENUE</p>

          <ul className="flex flex-col gap-3">
            {venues.map((venue) => (
              <li key={venue.id} className="flex flex-row gap-2.5 items-center">
                <div
                  onClick={() => handleFilter(venue.id)}
                  className={`w-4.5 h-4.5 flex items-center justify-center border-2 rounded-[5px] border-[#505261] cursor-pointer ${
                    selectedVenues.includes(venue.id) && "bg-[#EC3013]"
                  }`}
                >
                  {selectedVenues.includes(venue.id) && (
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

        <div className="flex flex-col gap-3 pb-6 border-b border-b-[#2A2C3D] mt-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">DATE</p>

          <ul className="flex flex-row gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {dates.map((date) => (
              <li
                key={date.id}
                onClick={() => handleDate(date.id)}
                className={`w-9.25 h-13.5 shrink-0 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-[#2A2C3D] ${
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

        <div className="flex flex-col gap-3 pb-6 border-b border-b-[#2A2C3D] mt-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">FORMAT</p>

          <ul className="flex flex-col gap-3">
            {availableFormats.map((format) => (
              <li
                key={format.id}
                className="flex flex-row gap-2.5 items-center"
              >
                <div
                  onClick={() => handleFormat(format.id)}
                  className={`w-4.5 h-4.5 flex items-center justify-center border-2 rounded-[5px] border-[#505261] cursor-pointer ${
                    selectedFormats.includes(format.id) && "bg-[#EC3013]"
                  }`}
                >
                  {selectedFormats.includes(format.id) && (
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

        <div className="flex flex-col gap-3 pb-6 border-b border-b-[#2A2C3D] mt-6">
          <p className="text-[12px] font-medium text-[#A9A9A9]">LANGUAGE</p>

          <ul className="flex flex-col gap-3">
            {languages.map((language) => (
              <li
                key={language.id}
                className="flex flex-row gap-2.5 items-center"
              >
                <div
                  onClick={() => handleLanguage(language.id)}
                  className={`w-4.5 h-4.5 flex items-center justify-center border-2 rounded-[5px] border-[#505261] cursor-pointer ${
                    selectedLanguages.includes(language.id) && "bg-[#EC3013]"
                  }`}
                >
                  {selectedLanguages.includes(language.id) && (
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
                  onClick={() => handleTimeOfDay(time.id)}
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
