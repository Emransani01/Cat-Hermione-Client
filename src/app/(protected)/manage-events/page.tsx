"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  CalendarX,
  AlertCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch events created by the logged-in user.
  const fetchMyEvents = useCallback(async () => {
    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/events/my/created-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load your events.");
      }

      setEvents(result.data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const refreshMyEvents = () => {
    setLoading(true);
    setError("");
    fetchMyEvents();
  };

  // Delete event.
  const handleDelete = async () => {
    if (!deletingEvent) return;

    try {
      setDeleting(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/api/events/${deletingEvent._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete event.");
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== deletingEvent._id),
      );

      toast.success("Event deleted successfully!");
      setDeletingEvent(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete event.";

      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  // Loading state.
  if (loading) {
    return (
      <section className="min-h-screen bg-base-100 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-9 w-64 animate-pulse rounded-lg bg-base-300" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="skeleton h-20 w-full rounded-lg sm:w-28" />

                <div className="flex-1 space-y-3">
                  <div className="skeleton h-5 w-1/2" />
                  <div className="skeleton h-4 w-1/3" />
                </div>

                <div className="skeleton h-9 w-40" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-base-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Event Dashboard</p>

            <h1 className="page-heading mt-2">Manage Events</h1>

            <p className="mt-2 text-base-content/60">
              View, update and manage the events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="btn btn-primary min-h-11 gap-2 self-start rounded-lg"
          >
            <Plus size={18} />
            Create Event
          </Link>
        </div>

        {/* Total Events */}
        <div className="surface-card mb-8 flex items-center justify-between p-5">
          <p className="text-sm text-base-content/60">Your Total Events</p>

          <p className="text-3xl font-bold text-primary">
            {events.length}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-[14px] border border-error/30 bg-error/10 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-1 text-error" size={22} />

              <div className="flex-1">
                <h2 className="font-semibold text-base-content">
                  Unable to load events
                </h2>

                <p className="mt-1 text-sm text-base-content/70">{error}</p>

                <button
                  onClick={refreshMyEvents}
                  className="btn btn-sm btn-primary mt-4 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && events.length === 0 && (
          <div className="empty-panel">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
              <CalendarX size={32} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-base-content">
              No Events Created Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
              You have not created any events yet. Start by creating your first
              community event.
            </p>

            <Link
              href="/create-event"
              className="btn btn-primary mt-6 rounded-lg"
            >
              <Plus size={18} />
              Create Your First Event
            </Link>
          </div>
        )}

        {/* Event Rows */}
        {!error && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event) => (
              <article
                key={event._id}
                className="surface-card flex flex-col gap-4 p-4 transition hover:border-primary/40 sm:flex-row sm:items-center"
              >
                {/* Event Image */}
                <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-base-300 sm:h-20 sm:w-28">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Event Details */}
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-content">
                    {event.eventType}
                  </span>

                  <h2 className="mt-2 truncate text-lg font-bold text-base-content">
                    {event.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <p className="meta-text">
                      <CalendarDays size={15} className="shrink-0 text-primary" />
                      {formatDate(event.eventDate)}
                    </p>

                    <p className="meta-text">
                      <MapPin size={15} className="shrink-0 text-primary" />
                      <span className="line-clamp-1">{event.location}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Link
                    href={`/events/${event._id}`}
                    className="btn btn-sm gap-1 rounded-lg border border-primary/30 bg-base-100 text-primary hover:bg-secondary"
                    aria-label={`View ${event.title}`}
                  >
                    <Eye size={15} />
                    View
                  </Link>

                  <Link
                    href={`/update-event/${event._id}`}
                    className="btn btn-accent btn-sm gap-1 rounded-lg"
                    aria-label={`Edit ${event.title}`}
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeletingEvent(event)}
                    className="btn btn-error btn-sm gap-1 rounded-lg text-error-content"
                    aria-label={`Delete ${event.title}`}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md rounded-[14px] border border-base-300 bg-base-100">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                <Trash2 size={24} />
              </div>

              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                disabled={deleting}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Close delete confirmation"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="mt-5 text-xl font-bold text-base-content">
              Delete This Event?
            </h3>

            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Are you sure you want to delete{" "}
              <strong className="text-base-content">
                {deletingEvent.title}
              </strong>
              ? This action cannot be undone. Related join records will also be
              deleted.
            </p>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                disabled={deleting}
                className="btn rounded-lg border border-base-300 bg-base-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="btn btn-error rounded-lg text-error-content"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close confirmation"
            onClick={() => !deleting && setDeletingEvent(null)}
          />
        </div>
      )}
    </section>
  );
}
