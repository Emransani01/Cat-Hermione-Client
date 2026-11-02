"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  RefreshCw,
  TicketCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type JoinedEvent = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  joinedAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(date));
}

export default function JoinedEventsPage() {
  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJoinedEvents = useCallback(async () => {
    try {
      const tokenResponse = await authClient.token();
      const accessToken = tokenResponse.data?.token;

      if (!accessToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/events/my/joined-events`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch your joined events.",
        );
      }

      setEvents(result.data || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJoinedEvents();
  }, [fetchJoinedEvents]);

  const refreshJoinedEvents = () => {
    setLoading(true);
    setError("");
    fetchJoinedEvents();
  };

  return (
    <section className="min-h-screen bg-base-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <TicketCheck size={18} />
              <span>Your Participation</span>
            </div>

            <h1 className="page-heading">Joined Events</h1>

            <p className="mt-2 text-base-content/65">
              Explore the community events you have joined.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-content">
              {events.length} {events.length === 1 ? "Event" : "Events"}
            </span>

            <button
              onClick={refreshJoinedEvents}
              disabled={loading}
              className="btn btn-sm gap-2 rounded-lg border border-base-300 bg-base-100 text-base-content hover:border-primary/40 hover:bg-secondary"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="surface-card overflow-hidden">
                <div className="skeleton aspect-[16/9] w-full rounded-none" />

                <div className="space-y-4 p-5">
                  <div className="skeleton h-5 w-2/3" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="empty-panel">
            <AlertCircle className="mx-auto mb-3 text-error" size={36} />
            <h2 className="text-xl font-bold text-base-content">
              Unable to load joined events
            </h2>
            <p className="mt-2 text-sm text-base-content/60">{error}</p>
            <button
              onClick={refreshJoinedEvents}
              className="btn btn-primary mt-5 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-panel">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
              <TicketCheck size={32} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-base-content">
              No Joined Events Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-base-content/60">
              You have not joined any community events yet. Explore upcoming
              events and become part of something meaningful.
            </p>

            <Link
              href="/upcoming-events"
              className="btn btn-primary mt-6 rounded-lg"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article key={event._id} className="event-card group">
                <div className="relative aspect-[16/9] overflow-hidden bg-base-300">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute right-3 top-3 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-secondary-content">
                    {event.eventType}
                  </span>
                </div>

                <div className="flex min-h-[250px] flex-col p-5">
                  <h2 className="line-clamp-2 text-lg font-bold text-base-content">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-base-content/60">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <p className="meta-text">
                      <CalendarDays
                        size={16}
                        className="shrink-0 text-primary"
                      />
                      <span>{formatDate(event.eventDate)}</span>
                    </p>

                    <p className="meta-text">
                      <MapPin size={16} className="shrink-0 text-primary" />
                      <span className="line-clamp-1">{event.location}</span>
                    </p>
                  </div>

                  <div className="mt-auto border-t border-base-300 pt-4">
                    <p className="mb-3 text-xs text-base-content/50">
                      Joined on: {formatDate(event.joinedAt)}
                    </p>

                    <Link
                      href={`/events/${event._id}`}
                      className="btn btn-primary btn-sm min-h-9 w-full rounded-lg"
                    >
                      View Event
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
