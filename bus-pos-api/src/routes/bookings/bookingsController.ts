export class BookingsController {
  async createBooking(req: Request, res: Response) {
    try {
      const booking = req.body;
      const newBooking = await db.bookings.create(booking);
      res.status(201).json(newBooking);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
}
