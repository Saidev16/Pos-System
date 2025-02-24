import { useUser } from "~/hooks/auth";
import { useNavigate } from "@tanstack/react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "admin" | "agent";
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  if (user.role !== allowedRole) {
    navigate({
      to: user.role === "admin" ? "/admin/bookings" : "/dashboard/agent",
    });
    return null;
  }

  return <>{children}</>;
}
