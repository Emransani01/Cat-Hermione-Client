"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartHandshake,
  LogIn,
  Menu,
  User,
  CalendarPlus,
  CalendarDays,
  Users,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

import ThemeToggle from "./theme-toggle";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Upcoming Events", href: "/upcoming-events" },
];

const userMenuLinks = [
  {
    label: "Create Event",
    href: "/create-event",
    icon: CalendarPlus,
  },
  {
    label: "Manage Events",
    href: "/manage-events",
    icon: CalendarDays,
  },
  {
    label: "Joined Events",
    href: "/joined-events",
    icon: Users,
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  
  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("Logged out successfully!");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="navbar-start gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
              <HeartHandshake size={24} />
            </span>

            <span className="text-lg font-bold tracking-tight text-base-content sm:text-xl">
              Cat<span className="text-primary">-Hermione</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal items-center gap-2 px-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`font-medium transition ${
                      isActive
                        ? "bg-secondary text-primary underline decoration-primary decoration-2 underline-offset-4"
                        : "text-base-content hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Side */}
        <div className="navbar-end gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authentication Loading */}
          {isPending ? (
            <div className="skeleton h-10 w-24 rounded-lg" />
          ) : user ? (
            /* Logged In: Profile Button */
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost gap-2"
                aria-label="Open profile menu"
                title={user.name}
              >
                <div className="avatar">
                  <div className="w-8 rounded-full bg-secondary">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary">
                        <User size={19} />
                      </div>
                    )}
                  </div>
                </div>

                <span>Profile</span>
              </button>

              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-3 shadow-lg"
              >
                <li className="menu-title px-3 py-2">
                  <span className="text-base font-bold text-base-content">
                    {user.name}
                  </span>
                  <span className="text-xs font-normal text-base-content/60">
                    {user.email}
                  </span>
                </li>

                <div className="divider my-1" />

                <li>
                  <Link href="/profile">
                    <User size={17} />
                    My Profile
                  </Link>
                </li>

                {userMenuLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <li key={link.href}>
                      <Link href={link.href}>
                        <Icon size={17} />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                <div className="divider my-1" />

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-error"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            /* Logged Out: Login Button */
            <Link href="/login" className="btn btn-primary btn-sm">
              <LogIn size={17} />
              Login
            </Link>
          )}

          {/* Mobile and Tablet Hamburger Menu */}
          <div className="dropdown dropdown-end lg:hidden">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              aria-label="Open navigation menu"
              title="Open Menu"
            >
              <Menu size={24} />
            </button>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-60 max-w-[calc(100vw-2rem)] rounded-box border border-base-300 bg-base-100 p-3 shadow-lg"
            >
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`font-medium transition ${
                        isActive
                          ? "bg-secondary text-primary underline decoration-primary decoration-2 underline-offset-4"
                          : "text-base-content hover:bg-secondary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
