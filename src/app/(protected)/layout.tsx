import type { ReactNode } from "react";
import ProtectedRoute from "@/components/shared/protected-route";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}