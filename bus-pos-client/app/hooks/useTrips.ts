import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { api } from "~/lib/api";
import { Trip, TripSearch } from "~/utils/types";

export const useTrips = (search: TripSearch) => {
  return useQuery({
    queryKey: ["trips"],
    queryFn: async ({ queryKey, signal }) => {
      return [];
    },
    enabled: false,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTrip: Omit<Trip, "id">) => {
      const { data } = await api.post<Trip>("/trips", newTrip);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};

export const useSearchTrips = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (search: TripSearch) => {
      const { data } = await api.post<Trip[]>("/trips/search", {
        ...search,
        departureDate: format(
          new Date(search.departureDate ?? new Date()),
          "yyyy-MM-dd'T'00:00:00.000'Z'"
        ),
      });

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["trips"], data);
    },
    onError: () => {
      queryClient.setQueryData(["trips"], []);
    },
  });
};
