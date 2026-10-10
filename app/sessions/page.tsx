import SessionsFilters from "@/features/sessions/components/SessionsFilters";
import SessionsResults from "@/features/sessions/components/SessionsResults";

const SessionsPage = () => {
  return (
    <main className="min-h-screen bg-[#070C1C] px-15 text-white">
      <section>
        <h1 className="text-2xl font-bold">Sessions</h1>

        <p className="mt-1 text-sm text-[#A9A9A9]">
          Browse showtimes across all venues
        </p>

        <div className="flex flex-row items-start gap-12 mt-9">
          <div className="mt-[6.5px] shrink-0">
            <SessionsFilters />
          </div>

          <div className="min-w-0 flex-1 mt-?">
            <SessionsResults />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SessionsPage;
