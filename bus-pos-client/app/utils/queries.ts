import { api } from "~/lib/api";

export const tripsQueryOptions = (search?: {
  departureCity?: string;
  destinationCity?: string;
  departureDate?: string;
}) => ({
  queryKey: ["trips", search] as const,
  queryFn: async () => {
    const { data } = await api.get("/trips/search", { params: search });
    return data;
  },
});
