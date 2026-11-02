"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  ImagePlus,
  Leaf,
  MapPin,
  Send,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Event title must be at least 3 characters."),
    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters."),
    eventType: z.string().min(1, "Please select an event type."),
    thumbnail: z.string().url("Please enter a valid image URL."),
    location: z
      .string()
      .trim()
      .min(3, "Location must be at least 3 characters."),
    eventDate: z.string().min(1, "Please select an event date."),
  })
  .refine(
    (data) =>
      data.eventDate >
      new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Dhaka",
      }),
    {
      message: "Event date must be in the future.",
      path: ["eventDate"],
    },
  );

type EventFormData = z.infer<typeof eventSchema>;

const eventTypes = [
  "Environment",
  "Education",
  "Health",
  "Community Support",
  "Animal Welfare",
  "Other",
];

const defaultValues: EventFormData = {
  title: "",
  description: "",
  eventType: "",
  thumbnail: "",
  location: "",
  eventDate: "",
};

export default function CreateEventPage() {
  const [preview, setPreview] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  const thumbnail = watch("thumbnail");

  const onSubmit = async (data: EventFormData) => {
    try {
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication failed. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || "Failed to create event.");
        return;
      }

      reset(defaultValues);
      setPreview("");

      toast.success("Event created successfully!");
      router.push("/upcoming-events");
    } catch (error) {
      console.error("Create event error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const minDate = tomorrow.toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka",
  });

  return (
    <section className="min-h-screen bg-base-100 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
        {/* Main Form */}
        <div>
          <div className="mb-7">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-content">
              <Sparkles size={15} />
              Make an Impact
            </span>

            <h1 className="page-heading">Create an Event</h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
              Bring people together, share your ideas, and make a positive
              difference in your community.
            </p>
          </div>

          <div className="surface-card p-5 sm:p-8">
            <div className="mb-7 flex items-center gap-3 border-b border-base-300 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
                <HeartHandshake size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-base-content">
                  Event Information
                </h2>
                <p className="text-sm text-base-content/60">
                  Fill in the details to organize your event.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Event Title */}
              <div>
                <label className="form-label" htmlFor="title">
                  Event Title
                </label>

                <input
                  id="title"
                  {...register("title")}
                  placeholder="e.g. Community Clean-up Day"
                  className="input input-bordered field h-11"
                />

                {errors.title && (
                  <p className="mt-1.5 text-sm text-error">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="form-label" htmlFor="description">
                  Event Description
                </label>

                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your event, its purpose and activities..."
                  rows={5}
                  className="textarea textarea-bordered field min-h-32"
                />

                <p className="mt-1 text-xs text-base-content/50">
                  Minimum 20 characters.
                </p>

                {errors.description && (
                  <p className="mt-1.5 text-sm text-error">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Event Type */}
              <div>
                <label className="form-label" htmlFor="eventType">
                  Event Type
                </label>

                <select
                  id="eventType"
                  {...register("eventType")}
                  className="select select-bordered field h-11"
                >
                  <option value="">Select an event category</option>

                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {errors.eventType && (
                  <p className="mt-1.5 text-sm text-error">
                    {errors.eventType.message}
                  </p>
                )}
              </div>

              {/* Thumbnail */}
              <div>
                <label className="form-label" htmlFor="thumbnail">
                  <span className="inline-flex items-center gap-2">
                    <ImagePlus size={17} className="text-primary" />
                    Thumbnail Image URL
                  </span>
                </label>

                <input
                  id="thumbnail"
                  type="url"
                  {...register("thumbnail", {
                    onChange: (e) => setPreview(e.target.value),
                  })}
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered field h-11"
                />

                {errors.thumbnail && (
                  <p className="mt-1.5 text-sm text-error">
                    {errors.thumbnail.message}
                  </p>
                )}

                {thumbnail && (
                  <div className="mt-4 rounded-xl border border-base-300 bg-base-200/50 p-3">
                    <p className="mb-3 text-sm font-semibold text-base-content/70">
                      Image Preview
                    </p>

                    <img
                      src={thumbnail}
                      alt="Event thumbnail preview"
                      onError={() => setPreview("")}
                      onLoad={() => setPreview(thumbnail)}
                      className={`max-h-64 w-full rounded-lg object-cover ${
                        preview === thumbnail ? "" : "hidden"
                      }`}
                    />

                    {preview !== thumbnail && (
                      <p className="py-4 text-center text-sm text-base-content/50">
                        Enter a valid image URL to see the preview.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Location and Date */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="form-label" htmlFor="location">
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={17} className="text-primary" />
                      Event Location
                    </span>
                  </label>

                  <input
                    id="location"
                    {...register("location")}
                    placeholder="e.g. Khulna, Bangladesh"
                    className="input input-bordered field h-11"
                  />

                  {errors.location && (
                    <p className="mt-1.5 text-sm text-error">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label" htmlFor="eventDate">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={17} className="text-primary" />
                      Event Date
                    </span>
                  </label>

                  <input
                    id="eventDate"
                    type="date"
                    min={minDate}
                    {...register("eventDate")}
                    className="input input-bordered field h-11"
                  />

                  {errors.eventDate && (
                    <p className="mt-1.5 text-sm text-error">
                      {errors.eventDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-base-300 pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary min-h-12 w-full rounded-lg"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Creating Event...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Create Event
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-base-content/50">
                  Please review your event information before submitting.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Side Panel */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-[14px] bg-neutral shadow-soft">
            <div
              className="relative min-h-[640px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=85')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/60 to-neutral/10" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-neutral-content">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-content/10 text-neutral-highlight">
                  <Leaf size={27} />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-highlight">
                  Your Impact Matters
                </span>

                <h2 className="mt-3 text-3xl font-bold leading-tight">
                  Every Great Change Starts With One Small Step.
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-content/75">
                  Create opportunities for people to connect, volunteer, and
                  make their communities better together.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
