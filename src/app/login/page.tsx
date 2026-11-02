
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Globe, Leaf } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Login failed. Check your credentials.");
        return;
      }

      toast.success("Login successful!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to login with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-56px)] bg-base-100 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[20px] border border-base-300 shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
        {/* Welcome Panel */}
        <div className="relative isolate overflow-hidden bg-neutral p-8 text-neutral-content sm:p-10 lg:min-h-[600px] lg:p-12">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=85')",
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
              <LogIn size={27} />
            </div>

            <h1 className="text-3xl font-bold leading-tight text-neutral-content sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-4 max-w-sm leading-7 text-neutral-content/75">
              Login to continue with Cat-Hermione.
            </p>

            <Leaf
              size={28}
              className="mt-8 text-neutral-highlight"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-[var(--surface-card-bg)] p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </label>

              <label className="block w-full">
                <span className="form-label">Password</span>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="input input-bordered field h-11 pl-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="btn btn-primary mt-2 min-h-11 w-full rounded-lg"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="divider my-6 text-xs text-base-content/50">
              OR
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
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

            <p className="mt-5 text-center text-sm text-base-content/70">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
