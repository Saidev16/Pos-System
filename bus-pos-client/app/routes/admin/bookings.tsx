import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useBookings } from "~/hooks/useBookings";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookingsPage,
});

function AdminBookingsPage() {
  const { data: bookings, isLoading } = useBookings();
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate total sales and other statistics
  const totalSales =
    bookings?.reduce((sum, booking) => sum + Number(booking.totalAmount), 0) ||
    0;

  const paidBookings = bookings?.filter((booking) => booking.isPaid) || [];
  const totalPaidAmount = paidBookings.reduce(
    (sum, booking) => sum + Number(booking.totalAmount),
    0
  );

  // Filter bookings based on search term
  const filteredBookings = bookings?.filter(
    (booking) =>
      booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passengerPhone.includes(searchTerm)
  );

  if (isLoading) {
    return <div>Loading bookings data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings Overview</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {bookings?.length || 0} total bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPaidAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {paidBookings.length} paid bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Bookings</h2>
          <div className="w-1/3">
            <Input
              placeholder="Search by passenger name or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings?.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.passengerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.passengerPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.tripId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.createdAt &&
                        format(new Date(booking.createdAt), "PPP")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
