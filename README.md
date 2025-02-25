# Bus Reservation System

A full-stack application for managing bus ticket bookings and reservations, built with a modern tech stack.

## 🎮 Live Demo
🚀 [Bus Reservation System](https://pos-system-front.onrender.com/login)

## 🚌 Project Overview

This Bus Reservation System allows travelers to search for bus trips, view available seats, and make bookings. The system includes role-based access control with admin and agent roles for managing trips and processing bookings.

## 🛠️ Tech Stack

### Backend
- **Framework**: Node.js with Express
- **Database**: MySQL with Drizzle ORM
- **Authentication**: JWT
- **Validation**: Zod
- **TypeScript**: For type safety and better developer experience

### Frontend
- **Framework**: React with TanStack Start
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query
- **UI Components**: Shadcn UI (Radix UI + Tailwind CSS)
- **Form Handling**: React Hook Form + Zod
- **Type Safety**: TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL
- pnpm (recommended) or npm

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/bus-reservation-system.git
   cd bus-reservation-system/bus-pos-api
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Create a `.env` file with the following variables
   ```
   DATABASE_URL=mysql://username:password@localhost:3306/bus_pos
   JWT_SECRET=your_secret_key
   PORT=3001
   ```

4. Run the database migrations
   ```bash
   pnpm run push
   ```

5. Seed the database
   ```bash
   pnpm run seed
   ```

6. Start the development server
   ```bash
   pnpm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd ../bus-pos-client
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Update the API base URL in `app/lib/api.ts` if needed

4. Start the development server
   ```bash
   pnpm run dev
   ```

## 👥 Demo Accounts

- **Admin Account**
  - Username: admin
  - Password: passpass

- **Agent Account**
  - Username: agent
  - Password: passpass

## 🏗️ Project Structure

### Backend Structure
```
bus-pos-api/
├── src/
│   ├── config/        # Configuration files
│   ├── db/            # Database connection and schema definitions
│   │   ├── schema.ts  # Main schema file
│   │   ├── schemas/   # Individual schema files
│   │   └── seed.ts    # Database seed script
│   ├── middlwares/    # Express middlewares (auth, validation)
│   ├── routes/        # API routes
│   │   ├── bookings/  # Booking-related routes and controllers
│   │   ├── seats/     # Seat-related routes and controllers
│   │   ├── trips/     # Trip-related routes and controllers
│   │   └── users/     # User-related routes and controllers
│   └── index.ts       # Entry point
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```

### Frontend Structure
```
bus-pos-client/
├── app/
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── routes/        # Application routes
│   ├── styles/        # Global styles and Tailwind config
│   ├── client.tsx     # Client entry point
│   └── server.tsx     # Server entry point
├── public/            # Static assets
├── postcss.config.mjs # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json       # Project dependencies
```

## 🎯 Key Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 📊 **Trip Management**: Create, update, and delete bus trips (Admin only)
- 🎫 **Seat Reservation**: Visual seat selection interface for booking
- 💳 **Payment Handling**: Mark bookings as paid
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop

## 🌟 Key Design Choices

1. **Separation of Concerns**: Clear separation between backend API and frontend application
2. **Type Safety**: Extensive use of TypeScript for better developer experience and fewer runtime errors
3. **Schema Validation**: Using Zod for validation both on the server and client
4. **TanStack Ecosystem**: Leveraging TanStack libraries for a unified development experience
5. **Component Library**: Using Shadcn UI components for a consistent design system
6. **ORM Usage**: Drizzle ORM for type-safe database operations
7. **RESTful API Design**: Clean API endpoints following REST principles

## 🔄 API Endpoints

### Authentication
- `POST /users/login` - User login
- `POST /users/register` - User registration (if enabled)

### Trips
- `GET /trips` - List all trips
- `GET /trips/:id` - Get trip details
- `POST /trips` - Create a new trip (Admin only)
- `PUT /trips/:id` - Update a trip (Admin only)
- `DELETE /trips/:id` - Delete a trip (Admin only)

### Seats
- `GET /seats` - List all seats
- `GET /seats/:id` - Get seat details
- `GET /seats/trip/:tripId` - Get seats for a specific trip
- `PUT /seats/:id` - Update seat availability

### Bookings
- `GET /bookings` - List all bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings` - Create a new booking
- `PUT /bookings/:id/pay` - Mark a booking as paid



## 👤 Contact

If you have any questions or feedback, please reach out to Boutouditsaid@gmail.com .
