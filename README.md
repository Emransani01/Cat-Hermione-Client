# Cat-Hermione — Social Development Events Platform

A social development events platform that brings people together to organize, discover, and participate in meaningful community activities.

**Live Website:** [Cat-Hermione](https://cat-hermione-client-eight.vercel.app)

---

## Project Overview

Cat-Hermione is a social development events platform designed to help people create community events, discover upcoming activities, connect with volunteers, and contribute to positive changes in their communities.

The platform provides an easy way for users to organize events, participate in meaningful activities, and manage their community involvement.

## Features

- User registration and login with Better Auth.
- Protected routes for authenticated users.
- Create, update, and delete community events.
- Browse upcoming events with search and filtering.
- Join and leave community events.
- Manage created events.
- View joined events.
- User profile management.
- Responsive design for mobile, tablet, and desktop.
- Light and dark theme support.
- Form validation with React Hook Form and Zod.
- Toast notifications for success and error feedback.
- JWT-based authentication with the server API.

## Technologies Used

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Better Auth
- React Hook Form
- Zod
- React Hot Toast
- Lucide React

### Backend

- Express.js
- MongoDB
- JWT
- JOSE

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB database
- Backend server configured and running

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Emransani01/Cat-Hermione-Client.git
```

**2. Navigate to the project directory**

```bash
cd Cat-Hermione-Client
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the root directory and add the required environment variables.

**5. Start the development server**

```bash
npm run dev
```

**6. Open your browser**

Visit:

```text
http://localhost:3000
```

## Environment Variables

Configure the following variables in your `.env.local` file:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=
MONGODB_URI=
DB_NAME=cat-hermione
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Environment Configuration Notes

- `BETTER_AUTH_URL` must point to the origin of the Next.js application.
- Better Auth runs inside the Next.js application at `/api/auth`.
- The JWKS endpoint is available at `/api/auth/jwks`.
- `BETTER_AUTH_SECRET` must contain a secure secret value.
- `MONGODB_URI` must contain your MongoDB connection string.
- `NEXT_PUBLIC_APP_URL` must point to the frontend application.
- `NEXT_PUBLIC_API_URL` must point to the Express backend server.
- Google OAuth credentials must be configured if Google authentication is enabled.
- In production, replace localhost URLs with the appropriate deployed frontend and backend URLs.
- `NEXT_PUBLIC_*` variables are embedded during the Next.js build process, so configure them before deploying to Vercel.

**Important:** Never commit `.env.local` or expose secret credentials in a public repository.

## Project Structure

```text
Cat-Hermione-Client/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── providers/
├── public/
├── package.json
├── README.md
└── .env.local
```

> The `.env.local` file should remain private and must not be committed to Git.

## Deployment

The frontend application is deployed on Vercel.

### Deploy to Vercel

You can deploy the project using the Vercel CLI:

```bash
vercel link
vercel deploy --prod
```

Before deploying:

1. Configure all required environment variables in your Vercel project.
2. Set production frontend and backend URLs.
3. Verify MongoDB connectivity.
4. Make sure authentication and API endpoints are correctly configured.
5. Deploy the application.

## Live Demo

[https://cat-hermione-client-eight.vercel.app](https://cat-hermione-client-eight.vercel.app)

## Author

**Md. Emran Hossain**

---

_Built with Next.js, Express.js, MongoDB, and Better Auth._
