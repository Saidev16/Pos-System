import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { Button } from "~/components/ui/button";
import { getStoredUser, useLogout, useUser } from "~/hooks/auth";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Pos Bus Ticketing System ",
        description: `Bus Ticketing System`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function AppLayout({ children }: { children: React.ReactNode }) {
  const user = getStoredUser();
  const navigate = useNavigate();

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const handleLogout = useLogout();
  const isAdminRoute = currentPath.startsWith("/admin");
  const isAgentRoute = currentPath.startsWith("/agent");

  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agent";
  const isLoginRoute = currentPath === "/login";

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user && isLoginRoute) {
      if (isAdmin) {
        navigate({ to: "/admin/bookings" });
      } else {
        navigate({ to: "/agent/trip" });
      }
      return;
    }
    // Redirect based on role access
    if (isAdminRoute && !isAdmin) {
      navigate({ to: "/agent/trip" });
      return;
    }

    if (isAgentRoute && !isAgent) {
      navigate({ to: "/admin/bookings" });
      return;
    }
  }, [
    user,
    currentPath,
    isAdmin,
    isAgent,
    isAdminRoute,
    isAgentRoute,
    navigate,
  ]);

  // Only show admin sidebar if user is admin and on an admin route
  const showAdminSidebar = isAdmin && isAdminRoute;

  return (
    <div className="min-h-screen flex flex-col">
      {user && !showAdminSidebar && (
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/agent/trip" className="text-xl font-bold">
                  Bus Ticketing System
                </Link>
              </div>

              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {user.username || "User"}
                  </span>

                  <Link to="/agent/trip" className="text-sm text-gray-700">
                    Search Trip
                  </Link>
                  <Link to="/agent/sales" className="text-sm text-gray-700">
                    Sales
                  </Link>

                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1">
        {/* Admin sidebar - only shown for admin users on admin routes */}
        {showAdminSidebar && (
          <aside className="bg-gray-800 text-white w-64 flex-shrink-0">
            <div className="p-4">
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>

            <nav className="mt-5">
              <div className="px-2 space-y-1">
                <Link
                  to="/admin/bookings"
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700"
                  activeProps={{ className: "bg-gray-700 text-white" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-4 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Bookings
                </Link>

                <Link
                  to="/admin/create-trip"
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700"
                  activeProps={{ className: "bg-gray-700 text-white" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-4 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Create Trip
                </Link>

                <div className="pt-6">
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </Button>
                </div>
              </div>
            </nav>
          </aside>
        )}

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className={showAdminSidebar ? "py-6 px-4 sm:px-6 lg:px-8" : ""}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function RootComponent() {
  return (
    <RootDocument>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <hr />

        {children}

        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
