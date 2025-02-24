import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { Booking } from "~/utils/types";

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await api.get<Booking[]>("/bookings");
      return data;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBooking: Omit<Booking, "id">) => {
      const { data } = await api.post<Booking>("/bookings", newBooking);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
