# DataVista

Employee management system built with React and GraphQL.

## Live Demo

- **Frontend**: https://data-vista-omega.vercel.app
- **Backend API**: [Coming soon - Railway deployment in progress]

## Demo Credentials

- Admin: admin@datavista.com / admin123
- Employee: employee@datavista.com / employee123

## Setup

You'll need Node.js 18+ and PostgreSQL installed.

### Backend

```bash
cd backend
pnpm install
```

Create a `.env` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/datavista"
JWT_SECRET="your-secret-here"
```

Run migrations and seed data:
```bash
pnpm prisma migrate dev
pnpm prisma:seed
pnpm dev
```

Backend runs on http://localhost:4000

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on http://localhost:5173

## Login

After seeding, you can login with:
- Admin: admin@datavista.com / admin123
- Employee: employee@datavista.com / employee123

## What's Inside

**Backend**: GraphQL API with authentication, employee records, tasks, and attendance tracking.

**Frontend**: React app with two view modes (grid/tile), employee details, search/filter, and role-based actions.

## Tech Used

- React + TypeScript
- GraphQL + Apollo
- Prisma + PostgreSQL
- TailwindCSS
