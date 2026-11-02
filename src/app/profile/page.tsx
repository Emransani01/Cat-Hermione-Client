
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Leaf,
  Mail,
  Save,
  User,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import ProtectedRoute from "@/components/shared/protected-route";

function ProfileContent() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentName = name ?? session?.user?.name ?? "";
  const currentImage = image ?? session?.user?.image ?? "";

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = currentName.trim();
    const trimmedImage = currentImage.trim();

    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    if (trimmedImage) {
      try {
        const imageUrl = new URL(trimmedImage);

        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          toast.error("Please provide a valid profile image URL.");
          return;
        }
      } catch {
        toast.error("Please provide a valid profile image URL.");
        return;
      }
    }

    try {
      setIsSaving(true);

      const { error } = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage,
      });

      if (error) {
        toast.error(error.message || "Profile update failed.");
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const user = session?.user;

  if (!user) return null;

  return (
    <section className="min-h-screen bg-base-100 px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
        >
          <ArrowLeft size={17} />
          Go Back
        </button>

        <div className="mb-7">
          <p className="eyebrow">Account</p>

          <h1 className="page-heading mt-2">My Profile</h1>

          <p className="mt-2 text-base-content/60">
            Manage your personal information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.35fr]">
          <aside className="surface-card relative overflow-hidden bg-neutral p-6 text-neutral-content">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/30 blur-2xl" />

            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary ring-4 ring-neutral-content/15">
                {currentImage.trim() ? (
                  <img
                    src={currentImage}
                    alt={currentName || "Profile picture"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={48} />
                )}
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                {currentName || "Your Name"}
              </h2>

              <p className="mt-1 break-all text-sm text-neutral-content/70">
                {user.email}
              </p>

              <span className="mt-4 inline-flex rounded-full bg-neutral-content/10 px-3 py-1 text-xs font-semibold text-neutral-content">
                Active Member
              </span>

              <div className="mt-8 border-t border-neutral-content/15 pt-6">
                <p className="text-xs uppercase tracking-[0.15em] text-neutral-content/50">
                  Community Profile
                </p>

                <p className="mt-3 text-sm leading-6 text-neutral-content/70">
                  Keep your details up to date so organizers and fellow
                  volunteers can connect with you.
                </p>
              </div>

              <Leaf size={34} className="mt-8 text-neutral-highlight" />
            </div>
          </aside>

          <div className="surface-card p-5 sm:p-8">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="form-label">
                  <span className="inline-flex items-center gap-2">
                    <User size={17} className="text-primary" />
                    Full Name
                  </span>
                </label>

                <input
                  type="text"
                  value={currentName}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="input input-bordered field h-11"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  <span className="inline-flex items-center gap-2">
                    <Camera size={17} className="text-primary" />
                    Profile Picture URL
                  </span>
                </label>

                <input
                  type="url"
                  value={currentImage}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                  className="input input-bordered field h-11"
                />

                <p className="mt-2 text-xs text-base-content/50">
                  Provide a valid image URL. Leave empty if you do not want a
                  profile picture.
                </p>
              </div>

              <div>
                <label className="form-label">
                  <span className="inline-flex items-center gap-2">
                    <Mail size={17} className="text-primary" />
                    Email Address
                  </span>
                </label>

                <input
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="input input-bordered field h-11 cursor-not-allowed bg-base-200"
                />

                <p className="mt-2 text-xs text-base-content/50">
                  Your registered email address cannot be changed here.
                </p>
              </div>

              <div className="border-t border-base-300 pt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary min-h-11 w-full rounded-lg sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
