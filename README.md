# QuickHire

QuickHire is a comprehensive recruitment platform designed to streamline the hiring process for both companies and job seekers. The project aims to provide an efficient, user-friendly, and scalable solution for managing job applications, candidate profiles, company profiles, messaging, and more.

## Demo
[Live Demo](https://quickhiredz.netlify.app/)

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Database & Migrations](#database--migrations)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
QuickHire was created to address the challenges faced by both employers and job seekers in the recruitment process. The platform offers:
- Seamless job posting and application management
- Real-time messaging and notifications
- Profile management for users and companies
- Advanced filtering and search capabilities
- Integration with third-party services (e.g., Cloudinary for media, Redis for caching, Supabase for database)
- Automated background tasks and cron jobs for scheduled operations

## Features
- **User Authentication & Authorization**
- **Company & User Profiles**
- **Job Posting & Application Tracking**
- **Real-Time Chat & Notifications**
- **PDF Generation for Attestations**
- **Admin Dashboard**
- **Responsive Frontend (React + Vite, deployed on Netlify)**
- **Backend API (Node.js + Express, deployed on Render)**
- **Database ORM (Prisma + Supabase)**
- **Cloudinary Integration for Media Uploads**
- **Redis Caching**
- **Background Tasks & Cron Jobs** (e.g., scheduled tasks in `backend/src/cron/BgTasks.js`)

## Tech Stack
### Frontend
- React
- Vite
- CSS Modules
- Netlify (for frontend hosting and deployment)

### Backend
- Node.js
- Express.js
- Prisma ORM
- Supabase (PostgreSQL-compatible cloud database)
- Redis
- Cloudinary
- Handlebars (for PDF templates)
- Render (for backend hosting and deployment)

### DevOps & Tooling
- ESLint
- Prettier
- Git & GitHub

## Folder Structure
```
backend/
  package.json
  prisma.config.js
  server.js
  prisma/
    schema.prisma
    migrations/
  src/
    config/
    controllers/
    cron/
    middlewares/
    routes/
    services/
    socket/
    templates/
frontend/
  package.json
  vite.config.js
  public/
  src/
    assets/
    components/
    context/
    pages/
    services/
    sockets/
```

## Getting Started
### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- Redis
- Cloudinary account (for media uploads)

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create a `.env` file as needed).
4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Database & Migrations
- Prisma is used as the ORM for managing the Supabase (PostgreSQL-compatible) database.
- All schema changes are tracked in `backend/prisma/migrations/`.
- To create a new migration:
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.
