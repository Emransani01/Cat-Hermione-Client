
import Link from "next/link";
import { HeartHandshake, Leaf } from "lucide-react";

function FacebookLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function LinkedInLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Become a Volunteer", href: "/register" },
];

const involvedLinks = [
  { label: "Login", href: "/login" },
  { label: "Create Account", href: "/register" },
  { label: "Find an Event", href: "/upcoming-events" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramLogo },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInLogo },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-neutral text-neutral-content">
      <Leaf
        size={220}
        strokeWidth={1}
        className="pointer-events-none absolute -left-16 -top-16 rotate-12 text-neutral-content/5"
      />

      <Leaf
        size={180}
        strokeWidth={1}
        className="pointer-events-none absolute -bottom-12 right-4 -rotate-12 text-neutral-content/5"
      />

      <div className="app-container relative">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-content">
                <HeartHandshake size={24} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Cat<span className="text-primary">-Hermione</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-content/70">
              Bringing people together through meaningful community
              activities, volunteer opportunities, and social initiatives.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-content/15 bg-neutral-content/5 text-neutral-content/80 transition hover:border-accent/60 hover:bg-accent hover:text-accent-content"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-content/15 bg-neutral-content/5 text-neutral-content/80 transition hover:border-accent/60 hover:bg-accent hover:text-accent-content"
              >
                <XLogo size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-neutral-content">
              Explore
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-neutral-content/70">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-neutral-highlight"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-neutral-content">
              Get Involved
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-neutral-content/70">
              {involvedLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-neutral-highlight"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-content/10">
          <div className="flex flex-col items-center justify-between gap-3 py-6 text-center text-sm text-neutral-content/50 md:flex-row">
            <p>© 2026 Cat-Hermione. All rights reserved.</p>
            <p>Made with care for a better community.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
