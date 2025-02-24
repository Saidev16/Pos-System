import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { useCreateTrip, useSearchTrips, useTrips } from "~/hooks/useTrips";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Trip } from "~/utils/types";
import { Combobox } from "~/components/ui/Combox";
import { MOROCCAN_CITIES } from "~/lib/constants/cities";
import { getStoredUser, useRequireAuth } from "~/hooks/auth";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export const Route = createFileRoute("/dashboard/agent")({
  component: TripsSearchView,
});

function TripsSearchView() {
  const [search, setSearch] = useState({
    departureCity: "",
    destinationCity: "",
    departureDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: trips, isLoading } = useTrips(search);
  const searchTrips = useSearchTrips();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchTrips.mutate(search);
  };

  return (
    <ProtectedRoute allowedRole="agent">
      <div className="space-y-10 space-x-5 max-w-[70%] m-auto p-36">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trips</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <Combobox
                  options={MOROCCAN_CITIES}
                  value={search.departureCity}
                  onValueChange={(value) =>
                    setSearch((s) => ({ ...s, departureCity: value }))
                  }
                  placeholder="Select departure city"
                />
                <Combobox
                  options={MOROCCAN_CITIES}
                  value={search.destinationCity}
                  onValueChange={(value) =>
                    setSearch((s) => ({ ...s, destinationCity: value }))
                  }
                  placeholder="Select destination city"
                />
                <Input
                  type="date"
                  value={search.departureDate}
                  onChange={(e) =>
                    setSearch((s) => ({ ...s, departureDate: e.target.value }))
                  }
                />
                <Button
                  type="submit"
                  className="w-6/12"
                  disabled={searchTrips.isPending}
                >
                  {searchTrips.isPending ? "Searching..." : "Search Trips"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {searchTrips.isPending ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">Loading...</div>
          </div>
        ) : searchTrips.isError ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">
                <p>Failed to load trips. Please try searching again.</p>
              </div>
            </CardContent>
          </Card>
        ) : trips?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <p>No trips found.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {trips?.map((trip: Trip) => (
              <Card key={trip.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {trip.departureCity} to {trip.destinationCity}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(trip.departureDate), "PPP")}
                      </p>
                      <p className="text-sm text-gray-500">
                        Bus: {trip.busNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${trip.price}</p>
                      <p className="text-sm text-gray-500">
                        {trip.totalSeats} seats total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
