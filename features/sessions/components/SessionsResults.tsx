import { mockMoviesWithSessions } from "../data/mockMoviesWithSessions";
import { mockSorts } from "../data/mockSorts";

import Image from "next/image";

const SessionsResults = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm font-medium text-white">Showing 12 sessions</p>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#A9A9A9]">Sort:</span>

          <select className="bg-transparent text-[12px] font-medium text-white outline-none">
            {mockSorts.map((sort) => (
              <option key={sort.id} value={sort.id} className="text-black">
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col border-b border-[#2A2C3D] pb-8 mt-6">
        <div className="flex flex-col gap-3.5">
          {/* poster and a movie */}
          <div className="flex flex-row gap-4">
            <Image
              src={mockMoviesWithSessions[0].posterUrl}
              alt="poster"
              width={56}
              height={80}
            />

            <div className="flex flex-col">
              <div className="flex flex-row gap-3 mt-3.5">
                <h3 className="text-[18px] font-bold text-white">
                  {mockMoviesWithSessions[0].title}
                </h3>

                <div className="mt-1 flex h-5.25 w-9.5 items-center justify-center rounded-full bg-[#EC3013]/10">
                  <p className="text-[12px] font-medium text-[#EC3013]">
                    {mockMoviesWithSessions[0].ageRating}
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium text-[#A9A9A9]">
                {mockMoviesWithSessions[0].runtimeMinutes} min
              </p>
            </div>
          </div>

          {/* sessions */}
          <div className="mt-3.5 flex flex-row overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            <ul className="flex flex-row gap-3 shrink-0">
              {mockMoviesWithSessions[0].sessions.map((session) => (
                <li
                  key={session.id}
                  className={`flex h-26 w-63 flex-col rounded-2xl bg-[#1E2031] px-3.75 py-3.75 ${
                    session.isSoldOut
                      ? "cursor-not-allowed opacity-40"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex flex-row justify-between">
                    <h3 className="text-[18px] font-bold text-white">
                      {session.time}
                    </h3>
                    <div className="w-auto h-5.75 flex items-center justify-center rounded-full px-2.5 bg-[#2A2C3D]">
                      <p className="text-[12px] font-medium text-white">
                        {session.format}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between mt-3">
                    <p className="text-[12px] font-medium text-[#A9A9A9]">
                      {session.language}
                    </p>

                    <div className="flex flex-row gap-0.5">
                      <Image
                        src={
                          session.seatsLeft <= 5
                            ? "/assets/images/sessions/ticketsRed.svg"
                            : "/assets/images/sessions/ticketsGreen.svg"
                        }
                        alt=""
                        width={12}
                        height={12}
                      />

                      <p
                        className={`text-[12px] font-medium ${
                          session.seatsLeft <= 5
                            ? "text-[#EC3013]"
                            : "text-[#4ADE80]"
                        }`}
                      >
                        {session.seatsLeft} left
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center mt-1.5">
                    <p className="text-[12px] font-medium text-white">
                      {session.venue} · {session.hall}
                    </p>

                    <p className="text-sm font-bold text-white">
                      ₾{session.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsResults;
