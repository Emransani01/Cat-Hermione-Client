"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  HeartHandshake,
  Clock,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import ShareButton from "./share-button";
import { authClient } from "@/lib/auth-client";

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorId?: string;
  creatorEmail?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(date));
}

function getDhakaDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Loading fallback for Suspense
function EventDetailsFallback() {
  return (
    <div className="min-h-screen bg-base-100 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="skeleton mb-8 h-6 w-48 rounded-lg" />

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-7">
            <div className="skeleton aspect-[4/3] w-full rounded-[14px]" />
            <div className="skeleton h-40 w-full rounded-[14px]" />
          </div>

          <div className="space-y-6">
            <div className="skeleton h-10 w-3/4 rounded-lg" />
            <div className="skeleton h-5 w-1/2 rounded-lg" />
            <div className="skeleton h-48 w-full rounded-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [checkingJoinStatus, setCheckingJoinStatus] = useState(true);

  // Fetch event details
  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        cache: "no-store",
      });

      const result: ApiResponse<Event> = await response.json();

      if (!response.ok || !result.success) {
        if (response.status === 404) {
          router.replace("/upcoming-events");
          return;
        }

        throw new Error(
          result.message || "Failed to fetch event details.",
        );
      }

      setEvent(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // Check whether the current user has joined this event
  useEffect(() => {
    let isActive = true;

    const checkJoinStatus = async () => {
      if (sessionPending) return;

      if (!session?.user) {
        setHasJoined(false);
        setCheckingJoinStatus(false);
        return;
      }

      try {
        setCheckingJoinStatus(true);

        const tokenResponse = await authClient.token();
        const accessToken = tokenResponse.data?.token;

        if (!accessToken) {
          if (isActive) {
            setHasJoined(false);
          }
          return;
        }

        const response = await fetch(
          `${API_URL}/api/events/my/joined-events`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          },
        );

        const result: ApiResponse<Event[]> = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to check your join status.",
          );
        }

        const alreadyJoined = (result.data || []).some(
          (joinedEvent) => joinedEvent._id === id,
        );

        if (isActive) {
          setHasJoined(alreadyJoined);
        }
      } catch (err) {
        console.error("Check join status error:", err);

        if (isActive) {
          setHasJoined(false);
        }
      } finally {
        if (isActive) {
          setCheckingJoinStatus(false);
        }
      }
    };

    checkJoinStatus();

    return () => {
      isActive = false;
    };
  }, [id, session, sessionPending]);

  // Join event
  const handleJoinEvent = async () => {
    if (hasJoined || joining || leaving || checkingJoinStatus) return;

    try {
      setJoining(true);

      const tokenResponse = await authClient.token();
      const accessToken = tokenResponse.data?.token;

      if (!accessToken) {
        toast.error("Please log in before joining this event.");
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/events/${id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (response.status === 409) {
        setHasJoined(true);
        toast.error(
          result.message || "You have already joined this event.",
        );
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to join this event.");
      }

      setHasJoined(true);
      toast.success("You have successfully joined this event!");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setJoining(false);
    }
  };

  // Leave event
  const handleLeaveEvent = async () => {
    if (!hasJoined || joining || leaving || checkingJoinStatus) return;

    try {
      setLeaving(true);

      const tokenResponse = await authClient.token();
      const accessToken = tokenResponse.data?.token;

      if (!accessToken) {
        toast.error("Please log in before leaving this event.");
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/events/${id}/leave`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to leave this event.");
      }

      setHasJoined(false);
      toast.success("You have successfully left this event.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLeaving(false);
    }
  };

  // Event loading state
  if (loading) {
    return <EventDetailsFallback />;
  }

  // Event error state
  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 px-4">
        <div className="surface-card max-w-md p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-error" size={40} />

          <h2 className="text-xl font-bold text-base-content">
            Unable to Load Event
          </h2>

          <p className="mt-2 text-sm text-base-content/60">
            {error || "Event not found."}
          </p>

          <button
            type="button"
            onClick={fetchEvent}
            className="btn btn-primary mt-6 rounded-lg"
          >
            Try Again
          </button>

          <Link
            href="/upcoming-events"
            className="btn mt-3 w-full rounded-lg border border-base-300 bg-base-100"
          >
            Back to Upcoming Events
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(event.eventDate);

  const eventDateInDhaka = getDhakaDate(new Date(event.eventDate));
  const todayInDhaka = getDhakaDate(new Date());

  const isPastEvent = eventDateInDhaka < todayInDhaka;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Back Navigation */}
      <section className="border-b border-base-300 bg-base-200/60">
        <div className="app-container py-5">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:gap-3"
          >
            <ArrowLeft size={18} />
            Back to Upcoming Events
          </Link>
        </div>
      </section>

      <main className="app-container py-10">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left Column: Image + Highlights */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-base-300 shadow-soft">
              <img
                src={event.thumbnail}
                alt={event.title}
                className="h-full w-full object-cover"
              />

              <span className="absolute right-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-content shadow-sm">
                {event.eventType}
              </span>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content">
                  <HeartHandshake size={25} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-base-content">
                    Be Part of Positive Change
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-base-content/65">
                    Your participation matters. Connect with volunteers,
                    contribute your time, and help create a stronger community.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details + Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-base-content/60">
                <span className="flex items-center gap-2">
                  <CalendarDays size={17} className="text-primary" />
                  {formattedDate}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={17} className="text-primary" />
                  {event.location}
                </span>
              </div>

              <h1 className="page-heading mt-3">{event.title}</h1>

              <p className="meta-text mt-3">
                <Users size={17} className="text-primary" />
                Join the community and make a difference.
              </p>
            </div>

            <div className="surface-card p-6">
              <h2 className="text-xl font-bold text-base-content">
                About This Event
              </h2>

              <div className="mt-4 whitespace-pre-line text-sm leading-7 text-base-content/70 sm:text-base">
                {event.description}
              </div>
            </div>

            <div className="surface-card p-6">
              <h2 className="text-xl font-bold text-base-content">
                Event Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* Event Date */}
                <div className="flex items-start gap-3 rounded-lg border border-base-300 bg-base-200/50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-base-content/50">
                      Event Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-base-content">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 rounded-lg border border-base-300 bg-base-200/50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-base-content/50">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-base-content">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Participation */}
                <div className="flex items-start gap-3 rounded-lg border border-base-300 bg-base-200/50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Users size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-base-content/50">
                      Participation
                    </p>
                    <p className="mt-1 text-sm font-semibold text-base-content">
                      Community Volunteers
                    </p>
                  </div>
                </div>

                {/* Event Status */}
                <div className="flex items-start gap-3 rounded-lg border border-base-300 bg-base-200/50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-base-content/50">
                      Event Status
                    </p>

                    <p
                      className={`mt-1 flex items-center gap-1 text-sm font-semibold ${
                        isPastEvent ? "text-error" : "text-success"
                      }`}
                    >
                      <CheckCircle2 size={15} />
                      {isPastEvent ? "Event Ended" : "Upcoming Event"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-6 border-t border-base-300" />

              {/* Join / Leave Button */}
              {isPastEvent ? (
                <button
                  type="button"
                  disabled
                  className="btn btn-disabled w-full rounded-lg"
                >
                  Event Has Ended
                </button>
              ) : (
                <button
                  type="button"
                  onClick={hasJoined ? handleLeaveEvent : handleJoinEvent}
                  disabled={joining || leaving || checkingJoinStatus}
                  className={`btn w-full rounded-lg ${
                    hasJoined ? "btn-outline btn-error" : "btn-primary"
                  }`}
                >
                  {joining ? (
                    <>
                      <LoaderCircle
                        size={19}
                        className="animate-spin"
                      />
                      Joining...
                    </>
                  ) : leaving ? (
                    <>
                      <LoaderCircle
                        size={19}
                        className="animate-spin"
                      />
                      Leaving...
                    </>
                  ) : checkingJoinStatus ? (
                    <>
                      <LoaderCircle
                        size={19}
                        className="animate-spin"
                      />
                      Checking...
                    </>
                  ) : hasJoined ? (
                    <>
                      <CheckCircle2 size={19} />
                      <span className="text-wrap">
                        Already Joined · Click to Leave
                      </span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake size={19} />
                      Join Event
                    </>
                  )}
                </button>
              )}

              <p className="mt-3 text-center text-xs leading-5 text-base-content/50">
                {hasJoined
                  ? "You are already part of this event. Click the button above to leave."
                  : "Log in before joining this community event."}
              </p>

              {/* Share Event */}
              <div className="mt-4">
                <ShareButton title={event.title} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Suspense boundary for useParams()
export default function EventDetailsPage() {
  return (
    <Suspense fallback={<EventDetailsFallback />}>
      <EventDetailsContent />
    </Suspense>
  );
}
