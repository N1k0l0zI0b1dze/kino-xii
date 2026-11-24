# KINO XII

A cinema ticket booking platform built with Next.js,
TypeScript, and modern web technologies.

## Project Overview

Kino XII is a web application designed to provide
a seamless cinema ticket booking experience.

Users can discover movies, explore available sessions,
select seats, manage their accounts, and book tickets
through a responsive and user-friendly interface.

The project was developed independently as part of
a technical assessment.

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS v4

### State Management & Data Fetching

- TanStack Query v5

### Forms & Validation

- React Hook Form
- Zod

### Backend Integration

- Next.js Route Handlers
- REST API
- HTTP-only Cookies
- Server-side API Proxy

### Development Tools

- Git & GitHub
- ESLint
- Figma
- Vercel

## Key Features

- Featured, now-playing, and upcoming movies
- Movie details and cinema sessions
- Debounced movie search
- User authentication
- HTTP-only cookie-based authentication
- Protected actions with automatic retry after login
- Seat selection and ticket booking
- Checkout flow
- User profile management
- Age-based booking restrictions
- Form validation
- Responsive user interface

## Architecture

The application uses Next.js Route Handlers as
a server-side proxy between the client application
and the external REST API.

```text
Client (React / Next.js)
          |
          v
Next.js Route Handlers
          |
          v
External REST API
```

This architecture was implemented to handle
cross-origin restrictions and manage authentication
through server-side HTTP-only cookies.

## Project Structure

```text
kino-xii/
├── app/
│   └── api/
├── components/
├── features/
├── lib/
│   └── api/
├── public/
└── package.json
```

The project separates application routes, reusable
components, feature-specific logic, and API utilities.

## Getting Started

### Clone the repository

```bash
git clone https://github.com/N1k0l0zI0b1dze/kino-xii.git
cd kino-xii
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Current Project Status

The original external backend API is no longer
accessible.

As a result, features that depend on the external API
are currently unavailable.

The existing frontend implementation is preserved,
and an independent backend is planned to restore
the application's functionality.

## Backend Development Roadmap

- [ ] Design backend architecture
- [ ] Design relational database schema
- [ ] Implement authentication and authorization
- [ ] Integrate an external movie data provider
- [ ] Implement movie and cinema session APIs
- [ ] Implement seat availability and reservations
- [ ] Implement ticket booking and order management
- [ ] Connect the existing frontend to the new backend
- [ ] Add automated tests
- [ ] Deploy the complete full-stack application

## Author

Nikoloz Iobidze

Junior Full-Stack Developer & Computer Science Student

- [GitHub](https://github.com/N1k0l0zI0b1dze)
- [LinkedIn](https://www.linkedin.com/in/nikoloz-iobidze-05719432b/)
