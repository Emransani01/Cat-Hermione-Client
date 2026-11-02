
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  HeartHandshake,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Sprout,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

type EventsResponse = {
  success: boolean;
  message: string;
  data: Event[];
};

const communityStats = [
  { label: "Active Volunteers", value: "1,550", icon: Users },
  { label: "Events Completed", value: "170", icon: CalendarDays },
  { label: "Lives Impacted", value: "22,000+", icon: Heart },
  { label: "Community Driven", value: "100%", icon: HeartHandshake },
];

const features = [
  {
    icon: HeartHandshake,
    title: "Make Real Impact",
    description:
      "Turn your kindness into meaningful action and make a positive difference in your community.",
  },
  {
    icon: Users,
    title: "Build Connections",
    description:
      "Meet passionate people, make new friends, and work together toward a better society.",
  },
  {
    icon: ShieldCheck,
    title: "Organize Easily",
    description:
      "Create events, manage volunteers, and keep track of your community activities in one place.",
  },
];

const communityValues = [
  {
    number: "01",
    title: "Community Driven",
    description: "Bringing people together for meaningful change.",
    icon: HeartHandshake,
  },
  {
    number: "02",
    title: "Shared Vision",
    description: "Working together toward a better future.",
    icon: Users,
  },
  {
    number: "03",
    title: "Real Impact",
    description: "Turning small actions into positive change.",
    icon: Sprout,
  },
  {
    number: "04",
    title: "Stronger Together",
    description: "Building a caring and connected community.",
    icon: Leaf,
  },
];

const gallery = [
  {
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=85",
    title: "Together for change",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=85",
    title: "Sharing kindness",
  },
  {
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=85",
    title: "A greener tomorrow",
  },
  {
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=85",
    title: "Helping one another",
  },
];

function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

export default function Home() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecentEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "6",
        sort: "latest",
      });

      const response = await fetch(
        `${API_URL}/api/events?${params.toString()}`,
        { cache: "no-store" },
      );

      const result: EventsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load upcoming events.");
      }

      setRecentEvents(result.data || []);
    } catch (err) {
      console.error("Home events fetch error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading events.",
      );

      setRecentEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentEvents();
  }, [fetchRecentEvents]);

  const handleRetryRecentEvents = () => {
    setLoading(true);
    setError("");
    fetchRecentEvents();
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative isolate mx-1 mt-1 overflow-hidden rounded-2xl bg-neutral sm:mx-4 sm:mt-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1600&q=90')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-neutral/95 via-neutral/80 to-neutral/35" />

        <Leaf
          size={260}
          strokeWidth={0.8}
          className="pointer-events-none absolute -left-16 -top-20 rotate-12 text-neutral-content/10"
        />

        <Leaf
          size={200}
          strokeWidth={0.8}
          className="pointer-events-none absolute -bottom-16 right-8 -rotate-12 text-neutral-content/10"
        />

        <div className="relative mx-auto flex min-h-[280px] max-w-7xl flex-col items-center justify-center px-5 py-8 text-center sm:min-h-[320px] sm:px-8 lg:min-h-[360px]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-content/20 bg-neutral-content/10 px-4 py-2 text-sm font-semibold text-neutral-content backdrop-blur-sm">
              <Sparkles size={16} className="text-neutral-highlight" />
              Together, We Can Make a Difference
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-neutral-content sm:text-5xl lg:text-[3.35rem]">
              Small Acts.
              <span className="block text-neutral-highlight">
                Big Changes.
              </span>
              Better Communities.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-neutral-content/75 sm:text-lg">
              Join a community of changemakers. Discover local events,
              volunteer your time, and help build a kinder, greener, and
              stronger society.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upcoming-events"
                className="btn btn-primary btn-lg min-h-12 rounded-lg px-7"
              >
                Explore Upcoming Events
                <ArrowRight size={19} />
              </Link>

              <Link
                href="/create-event"
                className="btn btn-lg min-h-12 rounded-lg border-accent bg-accent px-7 text-accent-content hover:border-accent hover:bg-accent/90"
              >
                Create an Event
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-neutral-content/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-neutral-highlight" />
                Community Driven
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-neutral-highlight" />
                Everyone Welcome
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:pb-12">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {communityStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-start gap-3 rounded-[14px] border border-neutral-content/20 bg-neutral/80 p-4 text-neutral-content shadow-soft backdrop-blur-md transition hover:border-accent/50 hover:bg-neutral/90 sm:flex-row sm:items-center"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-content/10 text-neutral-highlight">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xl font-bold leading-none text-neutral-content sm:text-2xl">
                      {stat.value}
                    </p>

                    <p className="mt-1.5 text-xs font-medium leading-5 text-neutral-content/70 sm:text-sm">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Values */}
      <section className="border-b border-base-300 bg-base-100 py-14 sm:py-16">
        <div className="app-container">
          <div className="mb-10 text-center">
            <span className="eyebrow">What We Believe</span>

            <h2 className="section-heading mt-3">
              Together, We Create Change
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-base-content/60">
              Every meaningful change begins with people who care. These values
              bring our community together.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {communityValues.map((item) => (
              <article
                key={item.number}
                className="surface-card group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="pointer-events-none absolute -right-4 -top-6 text-7xl font-black text-primary/[0.05]">
                  {item.number}
                </span>

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                    <item.icon size={24} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-base-content">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-base-content/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="bg-base-200/60 py-16 sm:py-20">
        <div className="app-container">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Get Involved</span>

              <h2 className="section-heading mt-3">Upcoming Events</h2>

              <p className="mt-3 max-w-xl leading-7 text-base-content/60">
                Discover opportunities to volunteer, connect with people, and
                make a difference in your community.
              </p>
            </div>

            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"
            >
              View All Events
              <ArrowUpRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="surface-card overflow-hidden">
                  <div className="skeleton h-48 w-full rounded-none" />

                  <div className="space-y-4 p-5">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="empty-panel">
              <AlertCircle className="mx-auto mb-4 text-error" size={38} />

              <h3 className="text-xl font-bold text-error">
                Unable to Load Events
              </h3>

              <p className="mt-2 text-sm text-base-content/60">{error}</p>

              <button
                type="button"
                onClick={handleRetryRecentEvents}
                className="btn btn-primary btn-sm mt-5 rounded-lg"
              >
                <LoaderCircle size={16} />
                Try Again
              </button>
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentEvents.map((event) => (
                <article key={event._id} className="event-card group">
                  <div className="relative aspect-[16/9] overflow-hidden bg-base-300">
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute right-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-content shadow-sm">
                      {event.eventType}
                    </span>
                  </div>

                  <div className="flex min-h-[190px] flex-col p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-base-content transition-colors group-hover:text-primary">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-2.5">
                      <p className="meta-text">
                        <CalendarDays size={16} className="text-primary" />
                        {formatEventDate(event.eventDate)}
                      </p>

                      <p className="meta-text">
                        <MapPin size={16} className="text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                      </p>
                    </div>

                    <div className="mt-auto border-t border-base-300 pt-4">
                      <Link
                        href={`/events/${event._id}`}
                        className="btn btn-primary btn-sm min-h-9 w-full rounded-lg"
                      >
                        View Event
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-panel">
              <CalendarDays className="mx-auto mb-4 text-primary" size={40} />

              <h3 className="text-xl font-bold text-base-content">
                No Upcoming Events Yet
              </h3>

              <p className="mt-2 text-sm text-base-content/60">
                New community events will appear here when they are created.
              </p>

              <Link
                href="/upcoming-events"
                className="btn btn-primary btn-sm mt-5 rounded-lg"
              >
                Explore Events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-base-100 py-16 sm:py-20">
        <div className="app-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow">Why Cat-Hermione</span>

            <h2 className="section-heading mt-3">Make Every Action Count</h2>

            <p className="mt-4 leading-7 text-base-content/60">
              We make it easier for people to come together, organize meaningful
              activities, and create positive change.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="surface-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                  <feature.icon size={24} />
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  0{index + 1}
                </span>

                <h3 className="mt-2 text-xl font-bold text-base-content">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-base-content/60">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <section className="bg-base-200/60 py-16 sm:py-20">
        <div className="app-container">
          <div className="mb-10 text-center">
            <span className="eyebrow">Our Community</span>

            <h2 className="section-heading mt-3">Moments That Matter</h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-base-content/60">
              Every small contribution becomes part of a bigger story.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {gallery.map((item) => (
              <div
                key={item.title}
                className="group relative h-48 overflow-hidden rounded-[14px] bg-base-300 shadow-soft sm:h-64"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 via-transparent to-transparent" />

                <p className="absolute bottom-4 left-4 right-4 text-sm font-bold text-neutral-content sm:text-base">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Design Only */}
      <section className="bg-base-100 px-5 pb-16 pt-16 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[20px] bg-neutral px-6 py-14 text-center text-neutral-content sm:px-12 sm:py-16">
          <Leaf
            size={180}
            strokeWidth={0.8}
            className="pointer-events-none absolute -left-10 -top-10 rotate-12 text-neutral-content/5"
          />

          <Leaf
            size={150}
            strokeWidth={0.8}
            className="pointer-events-none absolute -bottom-10 right-4 -rotate-12 text-neutral-content/5"
          />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-content/10">
              <HeartHandshake size={28} className="text-neutral-highlight" />
            </div>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Be Part of Something Good
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-neutral-content/70">
              Stay connected with community activities, upcoming events, and
              inspiring stories of positive change.
            </p>

            <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                className="input input-lg min-h-12 min-w-0 flex-1 rounded-lg border-0 bg-base-100 text-base-content placeholder:text-base-content/50"
              />

              <button
                type="button"
                className="btn btn-lg min-h-12 rounded-lg border-0 bg-accent text-accent-content hover:bg-accent/90"
              >
                Stay Connected
                <ArrowRight size={18} />
              </button>
            </div>

            <p className="mt-4 text-xs text-neutral-content/50">
              Newsletter preview only. Subscription functionality is not
              enabled.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
