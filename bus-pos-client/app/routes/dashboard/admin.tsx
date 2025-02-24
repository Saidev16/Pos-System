import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { Button } from "~/components/ui/button";
import { getStoredUser, useRequireAuth } from "~/hooks/auth";

export const Route = createFileRoute("/dashboard/admin")({
  component: AdminDashboard,
  // beforeLoad: ({ context }) => {
  //   const user = getStoredUser();
  //   console.log("log user", user);
  //   if (!user || user.role !== "admin") {
  //     return redirect({ to: "/dashboard/agent" });
  //   }
  // },
});

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="space-y-6 p-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => navigate({ to: "/dashboard/create-trip" })}>
          Add New Trip
        </Button>
      </div>
    </ProtectedRoute>
  );
}
