import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const useSeats = (tripId: number) => {
  return useQuery({
    queryKey: ["seats", tripId],
    queryFn: async () => {
      const { data } = await api.get(`/seats/trip/${tripId}`);
      return data;
    },
    enabled: !!tripId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: any) => {
      const { data } = await api.post("/bookings", bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seats"] });
    },
  });
};
