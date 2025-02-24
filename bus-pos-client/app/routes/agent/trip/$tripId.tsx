import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useCreateBooking, useSeats } from "~/hooks/useSeats";
import { useTripDetails } from "~/hooks/useTrips";
import { Seat } from "~/utils/types";
import { useUpdatePayment } from "~/hooks/useBookings";
import { generateTicketPDF } from "~/components/TicketGenerator";

// Form validation schema
const bookingSchema = z.object({
  passengerName: z.string().min(1, "Passenger name is required"),
  passengerPhone: z.string().min(1, "Phone number is required"),
  passengerEmail: z.string().email("Invalid email").optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const Route = createFileRoute("/agent/trip/$tripId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tripId } = Route.useParams();
  const { data: trip } = useTripDetails(Number(tripId));
  const { data: seats, isLoading } = useSeats(Number(tripId));
  const updatePayment = useUpdatePayment();

  const createBooking = useCreateBooking();

  // State for selected seat
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Form setup
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      passengerName: "",
      passengerPhone: "",
      passengerEmail: "",
    },
  });

  // Handle seat selection
  const handleSeatSelect = (seat: any) => {
    if (seat.isAvailable) {
      setSelectedSeat(seat.id);
    }
  };

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    if (!selectedSeat) {
      toast.error("Please select a seat first");
      return;
    }

    if (!trip) return;
    try {
      const createdBooking = await createBooking.mutateAsync({
        tripId: Number(tripId),
        seatId: selectedSeat,
        totalAmount: Number(trip?.price),
        ...data,
      });

      console.log("created booking", createdBooking);

      await updatePayment.mutateAsync(Number(createdBooking.id));

      generateTicketPDF(createdBooking.id, data, trip, selectedSeat);

      toast("Booking created successfully");

      // Reset form and selected seat
      form.reset();
      setSelectedSeat(null);
    } catch (error) {
      console.log("error");
      toast.error("Failed to create booking");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <div className="space-y-8 p-8">
      {/* Trip Info Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Trip Details</h1>
          <p className="text-gray-500">
            {trip.departureCity} to {trip.destinationCity}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">${trip.price}</p>
          <p className="text-gray-500">Per seat</p>
        </div>
      </div>

      {/* Trip Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Departure</p>
            <p className="font-medium">{trip.departureCity}</p>
            <p>{format(new Date(trip.departureDate), "PPP p")}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Destination</p>
            <p className="font-medium">{trip.destinationCity}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Bus Number</p>
            <p className="font-medium">{trip.busNumber}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Available Seats</p>
            <p className="font-medium">
              {seats?.filter((seat: Seat) => seat.isAvailable).length} of{" "}
              {trip.totalSeats}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Seat Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select a Seat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {seats?.map((seat: Seat) => (
              <Button
                key={seat.id}
                variant={seat.isAvailable ? "outline" : "ghost"}
                className={`
                    ${selectedSeat === seat.id && "bg-primary text-white"}
                  p-4 relative
                  ${!seat.isAvailable && "opacity-50 cursor-not-allowed"}
                `}
                disabled={!seat.isAvailable}
                onClick={() => handleSeatSelect(seat)}
              >
                <span className="text-sm">Seat {seat.seatNumber}</span>

                {!seat.isAvailable && (
                  <span className="absolute inset-0 flex items-center justify-center bg-background/80">
                    Booked
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Passenger Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="passengerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passenger Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passengerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passengerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedSeat || createBooking.isPending}
              >
                {createBooking.isPending ? "Creating Booking..." : "Book Seat"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
