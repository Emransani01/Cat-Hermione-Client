# Cat-Hermione

A social development events platform that brings people together to organize, discover, and participate in meaningful community activities.

## Project Overview

Cat-Hermione helps people create social development events, discover upcoming activities, connect with volunteers, and contribute to positive changes in their communities.

## Features

- User registration and login with Better Auth
- Protected routes for authenticated users
- Create, update, and delete community events
- Browse upcoming events with search and filtering
- Join and leave community events
- Manage created events
- View joined events
- User profile management
- Responsive design for mobile, tablet, and desktop
- Light and dark theme support
- Form validation and toast notifications
- JWT-based authentication with server API

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

### Prerequisites

- Node.js
- npm
- MongoDB database
- Backend server configured and running

### Installation

Clone the repository:

```bash
git clone YOUR_CLIENT_GITHUB_REPOSITORY_URL
```

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the client root and configure the required environment variables.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Configure the following variables in `.env.local`:

```env
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
MONGODB_URI=
DB_NAME=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Do not commit environment files or expose secret values.

## Project Structure

```text
client/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── providers/
├── public/
├── package.json
└── README.md
```

## Deployment

The frontend is designed to be deployed on Vercel.

Live Demo: Add your deployed frontend URL here.

## Author

Md. Emran Hossain
