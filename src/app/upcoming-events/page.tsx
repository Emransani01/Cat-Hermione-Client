"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Search,
  ArrowUpDown,
  Heart,
  X,
  SlidersHorizontal,
  PlusCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptySubscribe = () => () => {};

const categories = [
  "All Categories",
  "Environment",
  "Education",
  "Health",
  "Community Support",
  "Animal Welfare",
  "Other",
];

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  participants?: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Event[];
  pagination?: {
    totalEvents: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
};

function getDhakaDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function getTodayDhakaDate() {
  return getDhakaDate(new Date());
}

function getTomorrowDhakaDate() {
  const today = getTodayDhakaDate();
  const [year, month, day] = today.split("-").map(Number);

  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1));

  return [
    tomorrow.getUTCFullYear(),
    String(tomorrow.getUTCMonth() + 1).padStart(2, "0"),
    String(tomorrow.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function isUpcomingEvent(event: Event) {
  const eventDate = new Date(event.eventDate);

  if (Number.isNaN(eventDate.getTime())) {
    return false;
  }

  return getDhakaDate(event.eventDate) > getTodayDhakaDate();
}

function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("nearest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep current date outside the render phase
  const tomorrowDhaka = useSyncExternalStore(
    emptySubscribe,
    getTomorrowDhakaDate,
    () => "",
  );

  // Fetch upcoming events from the server
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category !== "All Categories") {
        params.set("category", category);
      }

      if (location !== "All Locations") {
        params.set("location", location);
      }

      params.set("sort", sort);
      params.set("page", "1");
      params.set("limit", "50");

      const response = await fetch(
        `${API_URL}/api/events?${params.toString()}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error("Failed to load upcoming events.");
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to load events.");
      }

      const upcomingEvents = (result.data || []).filter(isUpcomingEvent);

      setEvents(upcomingEvents);
    } catch (err) {
      console.error("Fetch events error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading events.",
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, location, sort]);

  // Debounce event fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchEvents]);

  // Apply date filter
  const filteredEvents = date
    ? events.filter((event) => getDhakaDate(event.eventDate) === date)
    : events;

  // Get available locations
  const availableLocations = [
    "All Locations",
    ...Array.from(new Set(events.map((event) => event.location))),
  ];

  // Reset all filters
  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setLocation("All Locations");
    setDate("");
    setSort("nearest");
  };

  const hasFilters =
    search !== "" ||
    category !== "All Categories" ||
    location !== "All Locations" ||
    date !== "" ||
    sort !== "nearest";

  return (
    <main className="min-h-screen bg-base-100">
      <section className="app-container py-10 sm:py-12">
        {/* Page Header */}
        <div className="mb-7 flex flex-col justify-between gap-5 border-b border-base-300 pb-6 lg:flex-row lg:items-end">
          <div>
            <span className="eyebrow inline-flex items-center gap-2">
              <CalendarDays size={13} />
              Future Community Drives
            </span>

            <h1 className="page-heading mt-3">Upcoming Events</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60">
              Discover volunteer initiatives scheduled for upcoming dates. Past
              and today&apos;s events are automatically excluded.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <label className="input input-bordered field flex h-11 w-full items-center gap-2 lg:w-72">
              <input
                type="search"
                className="grow bg-transparent text-sm"
                placeholder="Search events or areas..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-base-content/50 hover:text-error"
                >
                  <X size={15} />
                </button>
              ) : (
                <Search size={17} className="shrink-0 text-base-content/45" />
              )}
            </label>

            <Link
              href="/create-event"
              className="btn btn-primary min-h-11 shrink-0 gap-2 rounded-lg px-5"
            >
              <PlusCircle size={17} />
              Create Event
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0">
          {categories.map((item) => {
            const isActive = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-content"
                    : "border-base-300 bg-base-100 text-base-content/65 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {item === "All Categories" ? "All" : item}
              </button>
            );
          })}
        </div>

        {/* Additional Filters */}
        <details className="group mb-7 rounded-[14px] border border-base-300 bg-base-100 shadow-soft">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-base-content/70">
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={16} />
              More Filters
            </span>

            <span className="text-xs text-base-content/45 group-open:hidden">
              Show
            </span>

            <span className="hidden text-xs text-base-content/45 group-open:inline">
              Hide
            </span>
          </summary>

          <div className="grid gap-4 border-t border-base-300 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Location Filter */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-xs font-semibold text-base-content/65"
              >
                Location
              </label>

              <select
                id="location"
                className="select select-bordered field h-10"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              >
                {availableLocations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label
                htmlFor="event-date"
                className="mb-2 block text-xs font-semibold text-base-content/65"
              >
                Event Date
              </label>

              <input
                id="event-date"
                type="date"
                min={tomorrowDhaka || undefined}
                className="input input-bordered field h-10"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>

            {/* Sorting */}
            <div>
              <label
                htmlFor="sort"
                className="mb-2 block text-xs font-semibold text-base-content/65"
              >
                <span className="flex items-center gap-1">
                  <ArrowUpDown size={14} />
                  Sort Events
                </span>
              </label>

              <select
                id="sort"
                className="select select-bordered field h-10"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="nearest">Nearest First</option>
                <option value="latest">Latest First</option>
              </select>
            </div>
          </div>
        </details>

        {/* Events Heading */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-base-content sm:text-2xl">
              {category === "All Categories" ? "All Upcoming Events" : category}
            </h2>

            <p className="mt-1 text-xs text-base-content/50">
              Find an opportunity to make a difference.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-content">
            {filteredEvents.length} events found
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="surface-card overflow-hidden">
                <div className="skeleton aspect-[16/9] w-full rounded-none" />

                <div className="space-y-3 p-5">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="empty-panel">
            <h3 className="text-xl font-bold text-error">
              Unable to Load Events
            </h3>

            <p className="mt-2 text-sm text-base-content/60">{error}</p>

            <button
              type="button"
              onClick={fetchEvents}
              className="btn btn-primary btn-sm mt-5 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : filteredEvents.length > 0 ? (
          /* Event Cards */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article key={event._id} className="event-card group">
                {/* Event Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-base-300">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute right-3 top-3 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-secondary-content shadow-sm">
                    <span className="flex items-center gap-1">
                      <Heart size={11} />
                      {event.eventType}
                    </span>
                  </span>
                </div>

                {/* Event Content */}
                <div className="flex min-h-[210px] flex-col p-5">
                  <h3 className="line-clamp-1 text-lg font-bold text-base-content transition-colors group-hover:text-primary">
                    {event.title}
                  </h3>

                  <div className="mt-3 space-y-2">
                    <p className="meta-text">
                      <MapPin size={15} className="shrink-0 text-primary" />
                      <span className="line-clamp-1">{event.location}</span>
                    </p>

                    <p className="meta-text">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-primary"
                      />
                      {formatEventDate(event.eventDate)}
                    </p>
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-base-content/60">
                    {event.description}
                  </p>

                  <div className="mt-auto border-t border-base-300 pt-4">
                    <Link
                      href={`/events/${event._id}`}
                      className="btn btn-primary btn-sm min-h-9 w-full rounded-lg"
                    >
                      View Event
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="empty-panel">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
              <Search size={25} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-base-content">
              No Events Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
              No upcoming events match your current filters. Try changing your
              search criteria.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-primary btn-sm mt-5 rounded-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Clear Filters */}
        {!loading && !error && hasFilters && filteredEvents.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-ghost btn-sm text-error"
            >
              <X size={15} />
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
