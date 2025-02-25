import jsPDF from "jspdf";
import { format } from "date-fns";
import { Trip, Seat } from "~/utils/types";
import { BookingFormValues } from "~/routes/agent/trip/$tripId";

export function generateTicketPDF(
  bookingId: number,
  passengerData: BookingFormValues,
  tripData: Trip,
  seatNumber: Number
) {
  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Bus Ticket", pageWidth / 2, 20, { align: "center" });

  // Add booking reference
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Booking Reference: #${bookingId}`, 20, 35);
  doc.text(`Issue Date: ${format(new Date(), "PPP")}`, 20, 42);

  // Add trip details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Trip Details", 20, 55);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`From: ${tripData.departureCity}`, 20, 65);
  doc.text(`To: ${tripData.destinationCity}`, 20, 72);
  doc.text(
    `Date: ${format(new Date(tripData.departureDate), "PPP p")}`,
    20,
    79
  );
  doc.text(`Bus Number: ${tripData.busNumber}`, 20, 86);

  // Add passenger details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Passenger Details", 20, 100);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${passengerData.passengerName}`, 20, 110);
  doc.text(`Phone: ${passengerData.passengerPhone}`, 20, 117);
  if (passengerData.passengerEmail) {
    doc.text(`Email: ${passengerData.passengerEmail}`, 20, 124);
  }

  // Add seat details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Seat Information", 20, 140);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Seat Number: ${seatNumber}`, 20, 150);
  doc.text(`Price: ${tripData?.price} Dh`, 20, 164);
  doc.text(`Payment Status: Paid`, 20, 171);

  // Add footer
  doc.setFontSize(10);
  doc.text("Please present this ticket before boarding the bus.", 20, 190);
  doc.text("Thank you for choosing our service!", 20, 197);

  // Save the PDF
  doc.save(`ticket-${bookingId}.pdf`);
}
