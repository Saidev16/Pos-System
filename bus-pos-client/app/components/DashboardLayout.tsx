import { Link, Outlet, useNavigate } from "@tanstack/react-router";

export function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-xl font-bold">Bus POS</h2>
          <p className="text-sm text-gray-500">Welcome, {user?.username}</p>
        </div>

        <nav className="mt-4 space-y-1">
          <Link
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`
            }
          >
            Dashboard
          </Link>

          <Link
            to="/dashboard/trips"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`
            }
            search={{
              departureCity: "",
              destinationCity: "",
              date: "",
            }}
          >
            Trips
          </Link>

          <Link
            to="/dashboard/bookings"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`
            }
          >
            Bookings
          </Link>

          <Link
            to="/dashboard/sales"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`
            }
          >
            Sales
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
