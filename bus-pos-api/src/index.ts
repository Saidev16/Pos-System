import express from "express";

import cors from "cors";
import { config } from "./config/config";
const app = express();

import bookingRoutes from "./routes/bookings";
import seatRoutes from "./routes/seats";
import userRoutes from "./routes/users";
import tripRoutes from "./routes/trips";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.use("/users", userRoutes);
app.use("/trips", tripRoutes);
app.use("/seats", seatRoutes);
app.use("/bookings", bookingRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
