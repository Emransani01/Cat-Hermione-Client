"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  UserPlus,
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Leaf,
  Globe,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photoURL: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      toast.error("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      toast.error("Password must contain a lowercase letter.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        image: formData.photoURL.trim(),
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google registration failed.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to register with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-56px)] bg-base-100 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[20px] border border-base-300 shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
        {/* Welcome Panel */}
        <div className="relative isolate overflow-hidden bg-neutral p-8 text-neutral-content sm:p-10 lg:min-h-[700px] lg:p-12">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=85')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/80 to-neutral/40" />

          <Leaf
            size={220}
            strokeWidth={0.8}
            className="pointer-events-none absolute -left-12 -top-12 rotate-12 text-neutral-content/10"
          />

          <div className="relative flex h-full flex-col justify-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-content/10 text-neutral-highlight">
              <UserPlus size={27} />
            </div>

            <h1 className="text-3xl font-bold leading-tight text-neutral-content sm:text-4xl">
              Create Account
            </h1>

            <p className="mt-4 max-w-sm leading-7 text-neutral-content/75">
              Join Cat-Hermione and become part of a community that creates
              positive change.
            </p>

            <Leaf
              size={28}
              className="mt-8 text-neutral-highlight"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-[var(--surface-card-bg)] p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <label className="block w-full">
                <span className="form-label">Full Name</span>

                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="input input-bordered field h-11 pl-10"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </label>

              {/* Email */}
              <label className="block w-full">
                <span className="form-label">Email Address</span>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered field h-11 pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block w-full">
                <span className="form-label">Password</span>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />

                  <input
                    type="password"
                    placeholder="Create a strong password"
                    className="input input-bordered field h-11 pl-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>

                <span className="mt-2 block text-xs text-base-content/60">
                  Minimum 6 characters, including uppercase and lowercase.
                </span>
              </label>

              {/* Confirm Password */}
              <label className="block w-full">
                <span className="form-label">Confirm Password</span>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />

                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="input input-bordered field h-11 pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                  />
                </div>
              </label>

              {/* Photo URL */}
              <label className="block w-full">
                <span className="form-label">Photo URL</span>

                <div className="relative">
                  <ImageIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />

                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className="input input-bordered field h-11 pl-10"
                    value={formData.photoURL}
                    onChange={(e) =>
                      setFormData({ ...formData, photoURL: e.target.value })
                    }
                    required
                  />
                </div>
              </label>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="btn btn-primary mt-2 min-h-11 w-full rounded-lg"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="divider my-6 text-xs text-base-content/50">OR</div>

            {/* Google Registration Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading || googleLoading}
              className="btn min-h-11 w-full rounded-lg border border-base-300 bg-[var(--surface-card-bg)] text-base-content hover:border-primary/40 hover:bg-secondary"
            >
              {googleLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <Globe size={19} />
                  Continue with Google
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="mt-5 text-center text-sm text-base-content/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
