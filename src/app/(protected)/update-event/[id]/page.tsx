"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  Image as ImageIcon,
  Leaf,
  Loader2,
  MapPin,
  Save,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get today's date according to Bangladesh time.
function getTodayInDhaka() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Calculate tomorrow's date according to Bangladesh time.
function getTomorrowInDhaka() {
  const today = getTodayInDhaka();
  const [year, month, day] = today.split("-").map(Number);

  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1));

  return tomorrow.toISOString().slice(0, 10);
}

// Convert an event date into Bangladesh local date.
function getDhakaDate(date: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

// Event form validation.
const eventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters."),

  eventType: z.string().min(1, "Please select an event category."),

  thumbnail: z
    .string()
    .trim()
    .url("Please provide a valid image URL.")
    .refine(
      (value) => {
        try {
          return ["http:", "https:"].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      },
      "Image URL must start with http or https.",
    ),

  location: z.string().trim().min(3, "Location must be at least 3 characters."),

  eventDate: z
    .string()
    .min(1, "Please select an event date.")
    .refine(
      (value) => value > getTodayInDhaka(),
      "Event date must be a future date. Please select tomorrow or a later date.",
    ),
});

type EventFormData = z.infer<typeof eventSchema>;

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

const categories = [
  "Environment",
  "Education",
  "Health",
  "Community Support",
  "Animal Welfare",
  "Other",
];

export default function UpdateEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  // Fetch event details and verify ownership.
  const fetchEvent = useCallback(async () => {
    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load event.");
      }

      const event: Event = result.data;

      // Verify that the current user owns this event.
      const myEventsResponse = await fetch(
        `${API_URL}/api/events/my/created-events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const myEventsResult = await myEventsResponse.json();

      if (!myEventsResponse.ok) {
        throw new Error(
          myEventsResult.message || "Unable to verify event ownership.",
        );
      }

      const isOwner = (myEventsResult.data || []).some(
        (item: Event) => item._id === eventId,
      );

      if (!isOwner) {
        toast.error("You are not allowed to edit this event.");
        router.replace("/manage-events");
        return;
      }

      // Populate the form with existing event data.
      reset({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        thumbnail: event.thumbnail,
        location: event.location,
        eventDate: getDhakaDate(event.eventDate),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast.error(message);
      router.replace("/manage-events");
    } finally {
      setLoading(false);
    }
  }, [eventId, reset, router]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // Update event.
  const onSubmit = async (data: EventFormData) => {
    try {
      setSubmitting(true);

      // Recheck date before sending the request.
      if (data.eventDate <= getTodayInDhaka()) {
        toast.error("Please select a future event date.");
        return;
      }

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event.");
      }

      toast.success("Event updated successfully!");

      router.push("/manage-events");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update event.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state.
  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-base-100 px-4">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={40} />

          <p className="mt-4 text-sm text-base-content/60">
            Loading event details...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-base-100 px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.35fr_0.85fr]">
        <div>
          <Link
            href="/manage-events"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
          >
            <ArrowLeft size={17} />
            Back to Manage Events
          </Link>

          <div className="mb-7">
            <p className="eyebrow">Event Dashboard</p>

            <h1 className="page-heading mt-2">Update Event</h1>

            <p className="mt-2 text-sm text-base-content/60">
              Update your event information and save your changes.
            </p>
          </div>

          <div className="surface-card p-5 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Event Title */}
              <div>
                <label className="form-label">Event Title</label>

                <input
                  {...register("title")}
                  type="text"
                  placeholder="Enter event title"
                  className={`input input-bordered field h-11 ${
                    errors.title ? "input-error" : ""
                  }`}
                />

                {errors.title && (
                  <p className="mt-1 text-xs text-error">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description</label>

                <textarea
                  {...register("description")}
                  rows={5}
                  placeholder="Describe your community event..."
                  className={`textarea textarea-bordered field min-h-32 ${
                    errors.description ? "textarea-error" : ""
                  }`}
                />

                {errors.description && (
                  <p className="mt-1 text-xs text-error">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Event Category */}
              <div>
                <label className="form-label">Event Category</label>

                <select
                  {...register("eventType")}
                  className={`select select-bordered field h-11 ${
                    errors.eventType ? "select-error" : ""
                  }`}
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {errors.eventType && (
                  <p className="mt-1 text-xs text-error">
                    {errors.eventType.message}
                  </p>
                )}
              </div>

              {/* Thumbnail */}
              <div>
                <label className="form-label">
                  <span className="inline-flex items-center gap-2">
                    <ImageIcon size={16} className="text-primary" />
                    Thumbnail Image URL
                  </span>
                </label>

                <input
                  {...register("thumbnail")}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className={`input input-bordered field h-11 ${
                    errors.thumbnail ? "input-error" : ""
                  }`}
                />

                {errors.thumbnail && (
                  <p className="mt-1 text-xs text-error">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="form-label">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    Location
                  </span>
                </label>

                <input
                  {...register("location")}
                  type="text"
                  placeholder="Enter event location"
                  className={`input input-bordered field h-11 ${
                    errors.location ? "input-error" : ""
                  }`}
                />

                {errors.location && (
                  <p className="mt-1 text-xs text-error">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Event Date */}
              <div>
                <label className="form-label">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} className="text-primary" />
                    Event Date
                  </span>
                </label>

                <input
                  {...register("eventDate")}
                  type="date"
                  min={getTomorrowInDhaka()}
                  className={`input input-bordered field h-11 ${
                    errors.eventDate ? "input-error" : ""
                  }`}
                />

                <p className="mt-2 text-xs text-base-content/50">
                  Only future dates are allowed. Select tomorrow or a later date.
                </p>

                {errors.eventDate && (
                  <p className="mt-1 text-xs text-error">
                    {errors.eventDate.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-base-300 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/manage-events"
                  className="btn rounded-lg border border-base-300 bg-base-100"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary min-h-11 rounded-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-[14px] bg-neutral shadow-soft">
            <div
              className="relative min-h-[720px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=85')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/50 to-neutral/10" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-neutral-content">
                <Leaf size={34} className="text-accent" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
