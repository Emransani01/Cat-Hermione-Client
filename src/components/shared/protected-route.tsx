"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Track whether the user had an active session.
  const hadSession = useRef(false);

  useEffect(() => {
    if (session) {
      hadSession.current = true;
      return;
    }

    if (!isPending && !session) {
      if (hadSession.current) {
        // User logged out: redirect to Home.
        router.replace("/");
      } else {
        // User was not logged in: redirect to Login.
        router.replace("/login");
      }
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
