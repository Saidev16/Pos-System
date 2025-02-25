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
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  role: "admin" | "agent";
}

export interface Seat {
  id: number;
  tripId: number;
  seatNumber: number;
  isAvailable: boolean;
  seatPosition: "window" | "aisle";
  createdAt: string;
}
