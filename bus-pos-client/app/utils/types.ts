import { QueryClient } from "@tanstack/react-query";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Trip {
  id: number;
  departureCity: string;
  destinationCity: string;
  departureDate: string;
  price: number;
  busNumber: string;
  totalSeats: number;
}
export interface TripSearch {
  departureCity?: string;
  destinationCity?: string;
  departureDate?: string;
}

export interface Booking {
  id: number;
  tripId: number;
  seatId: number;
  userId: number;
  passengerName: string;
  passengerPhone: string;
  passengerEmail?: string;
  isPaid: boolean;
  totalAmount: number;
}

export interface User {
  id: number;
  username: string;
  role: "admin" | "agent";
}
