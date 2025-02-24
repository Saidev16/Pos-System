import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Combobox } from "~/components/ui/Combox";
import { MOROCCAN_CITIES } from "~/lib/constants/cities";
import { useCreateTrip } from "~/hooks/useTrips";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/create-trip")({
  component: CreateTripPage,
});

const createTripSchema = z
  .object({
    departureCity: z.string().min(1, "Departure city is required"),
    destinationCity: z.string().min(1, "Destination city is required"),
    departureDate: z.string().min(1, "Departure date is required"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
    busNumber: z.string().min(1, "Bus number is required"),
    totalSeats: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Total seats must be a positive number",
      }),
  })
  .refine((data) => data.departureCity !== data.destinationCity, {
    message: "Destination city must be different from departure city",
    path: ["destinationCity"],
  });

type CreateTripForm = z.infer<typeof createTripSchema>;

function CreateTripPage() {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();

  const form = useForm<CreateTripForm>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      departureCity: "",
      destinationCity: "",
      departureDate: "",
      price: "",
      busNumber: "",
      totalSeats: "",
    },
  });

  const onSubmit = async (data: CreateTripForm) => {
    try {
      await createTrip.mutateAsync({
        ...data,
        price: Number(data.price),
        totalSeats: Number(data.totalSeats),
        departureDate: `${data.departureDate}`,
      });

      toast("Trip created successfully");

      navigate({ to: "/dashboard/agent" });
    } catch (error) {
      toast.error("Failed to create trip. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Trip</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Departure City */}
                <FormField
                  control={form.control}
                  name="departureCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure City</FormLabel>
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
                      <FormLabel>Destination City</FormLabel>
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
                      <FormLabel>Departure Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bus Number */}
                <FormField
                  control={form.control}
                  name="busNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bus number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Total Seats */}
                <FormField
                  control={form.control}
                  name="totalSeats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Seats</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter total seats"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/dashboard/agent" })}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createTrip.isPending}>
                  {createTrip.isPending ? "Creating..." : "Create Trip"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
