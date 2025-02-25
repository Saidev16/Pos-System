import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { useSearchTrips, useTrips } from "~/hooks/useTrips";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Trip } from "~/utils/types";
import { Combobox } from "~/components/ui/Combox";
import { MOROCCAN_CITIES } from "~/lib/constants/cities";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";

const searchTripSchema = z
  .object({
    departureCity: z.string().min(1, "Departure city is required"),
    destinationCity: z.string().min(1, "Destination city is required"),
    departureDate: z.string().min(1, "Departure date is required"),
  })
  .refine((data) => data.departureCity !== data.destinationCity, {
    message: "Destination city must be different from departure city",
    path: ["destinationCity"],
  });

type SearchTripForm = z.infer<typeof searchTripSchema>;

export const Route = createFileRoute("/agent/trip/")({
  component: TripsSearchView,
});

function TripsSearchView() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: trips } = useTrips();
  const searchTrips = useSearchTrips();
  const navigate = useNavigate();

  const form = useForm<SearchTripForm>({
    resolver: zodResolver(searchTripSchema),
    defaultValues: {
      departureCity: "",
      destinationCity: "",
      departureDate: today,
    },
  });
  const onSubmit = (data: SearchTripForm) => {
    searchTrips.mutate(data);
  };

  return (
    <div className="space-y-10 space-x-5 max-w-[90%] m-auto p-36">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trips</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {/* Departure City */}
                <FormField
                  control={form.control}
                  name="departureCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox
                          options={MOROCCAN_CITIES}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select departure city"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Destination City */}
                <FormField
                  control={form.control}
                  name="destinationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox
                          options={MOROCCAN_CITIES}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select destination city"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Departure Date */}
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
          </Form>
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
            <Card
              key={trip.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() =>
                navigate({
                  to: "/agent/trip/$tripId",
                  params: { tripId: trip.id.toString() },
                })
              }
            >
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
                    <p className="font-medium">{trip.price} Dh</p>
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
  );
}
