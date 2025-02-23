import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="p-2">
      <div className="border-b">
        <p>Layout</p>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
