# Ticketmaster Clone

A full-stack event ticketing web application inspired by Ticketmaster. Users can browse events by genre, view event details, book tickets, and manage their account through role-based dashboards for attendees, organisers, and admins.

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** React
- **Database:** MySQL (via `mysql2`)
- **Authentication:** iron-session (session cookies), bcryptjs (password hashing)
- **Styling:** Plain CSS, split per page/feature
- **Environment config:** dotenv

## Project Structure

```
ticketmaster-clone/
├── app/
│   ├── api/                  API routes (Next.js route handlers)
│   │   ├── booking/          Create, fetch and manage bookings
│   │   ├── event/            Single event fetch, add, update, organiser events, search
│   │   ├── events/           List all events
│   │   ├── login/            Login endpoint
│   │   ├── logout/           Logout endpoint
│   │   ├── me/               Current session/user info
│   │   ├── register/         New user registration
│   │   └── user/             User lookup, search, update
│   │
│   ├── booking/[id]/         Booking confirmation/detail page
│   ├── components/           Shared UI components (Navbar, Footer, EventCard)
│   ├── dashboard/            Role-based dashboards
│   │   ├── admin/
│   │   ├── attendee/
│   │   └── organiser/
│   ├── events/                Event listing and detail pages
│   │   └── [genre]/[id]/      Event detail page, filtered by genre
│   ├── lib/                   Server-side helpers
│   │   ├── db.js               MySQL connection pool
│   │   ├── events.js            Event-related data logic
│   │   └── validation.js        Input validation helpers
│   ├── reset-password/        Password reset page
│   ├── settings/              Account settings page
│   ├── sign-in/               Sign-in page
│   ├── signup/                Sign-up flow
│   │   ├── attendee/
│   │   └── staff/
│   ├── styles/                 Page-specific CSS files
│   ├── layout.js                Root layout
│   └── page.js                  Home page
│
├── public/                   Static assets
├── sqldump.sql                MySQL schema and seed data
├── next.config.mjs
├── jsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js
- A running MySQL database

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a MySQL database and import the provided schema:
   ```
   mysql -u <user> -p <database_name> < sqldump.sql
   ```

3. Create a `.env` file in the project root with your database credentials:
   ```
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Browse events by genre
- View detailed event pages
- Book tickets and view booking details
- User authentication (sign up, sign in, password reset)
- Role-based dashboards for attendees, organisers, and admins
- Organiser tools for adding and updating events
- Search for events and users
