import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/trips")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/trips/"!</div>;
}
