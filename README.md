# DataVista

Hey there! 👋 This is DataVista, an employee management system I built to showcase modern full-stack development. It's designed to make managing employees, tracking attendance, and organizing tasks actually enjoyable.

## What's This About?

I wanted to create something that feels good to use. Most admin panels look like they're stuck in 2010, so I built this with modern UI/UX principles in mind. DataVista is clean, fast, and has some nice touches that make the experience smooth.

**Check it out live:**
- App: https://data-vista-omega.vercel.app
- GraphQL API: https://datavista-backend-zmdy.onrender.com/graphql

## What I Built It With

**Frontend:**
- React 19 with TypeScript (type safety is essential)
- Apollo Client for GraphQL queries and caching
- TailwindCSS for styling (utility-first approach)
- Framer Motion for smooth animations
- Zustand for lightweight state management
- Vite for blazing fast development

**Backend:**
- Node.js + TypeScript
- Apollo Server running GraphQL
- Prisma ORM (makes database work pleasant)
- PostgreSQL for data storage
- JWT authentication (secure but simple)

## Features That Matter

I focused on building features that actually improve the experience:

- **Dual view modes** - Switch between grid and tile views
- **Smart search** - Debounced search that's easy on the server
- **Skeleton loaders** - Show content structure while loading
- **Toast notifications** - Visual feedback for all actions
- **Role-based access** - Different capabilities for admins vs employees
- **Real-time updates** - GraphQL keeps data synchronized
- **Smooth animations** - Micro-interactions that feel polished
- **Fully responsive** - Works great on any device
- **Custom hooks** - Reusable logic for debouncing, local storage, and more

## Running It Locally

You'll need Node.js 18+ and PostgreSQL installed.

```bash
# Clone the repository
git clone https://github.com/PJaybee-10/DataVista.git
cd DataVista

# Backend setup
cd backend
npm install

# Create .env file with:
# DATABASE_URL="postgresql://user:password@localhost:5432/datavista"
# JWT_SECRET="your-random-secret-here"

# Run migrations and seed database
npx prisma migrate dev
npm run seed
npm run dev

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
```

The app will be at `http://localhost:5173` and API at `http://localhost:4000/graphql`

## Demo Accounts

Don't want to register? Use these:

**Admin access:**
- Email: admin@datavista.com
- Password: admin123

**Regular employee:**
- Email: employee@datavista.com
- Password: employee123

Admins can flag employees, delete records, and manage everything. Regular employees have read-only access with limited actions.

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.ts          # Sample data
│   │   └── migrations/      # Database migrations
│   └── src/
│       ├── types.ts         # TypeScript interfaces
│       ├── schema.ts        # GraphQL schema
│       ├── resolvers.ts     # GraphQL resolvers
│       ├── auth.ts          # Authentication logic
│       └── index.ts         # Server entry point
│
├── frontend/
│   └── src/
│       ├── components/      # React components
│       ├── apollo/          # GraphQL client config
│       ├── store/           # Zustand stores
│       ├── hooks/           # Custom React hooks
│       ├── types/           # TypeScript definitions
│       └── config/          # App constants
```

I organized it to keep concerns separated. Each piece has a clear purpose and they integrate cleanly.

## Technical Highlights

Things I'm particularly happy with:

- **Separation of concerns** - Schema, resolvers, and types are in separate files
- **Type safety everywhere** - Full TypeScript coverage on frontend and backend
- **Performance optimizations** - Memoization, debouncing, and smart caching
- **Error handling** - Proper error boundaries and user-friendly messages
- **Code reusability** - Custom hooks and shared utilities
- **Best practices** - ESLint, Prettier, and consistent patterns throughout

## Deployment

The frontend deploys automatically to Vercel when I push to the main branch. The backend runs on Render with a managed PostgreSQL database. Both are configured for zero-downtime deployments.

## What's Next?

There's always room to grow. Some ideas I'm considering:

- Dark mode support
- Bulk operations (import/export CSV)
- Advanced filtering and sorting
- Email notifications for important events
- Activity audit logs
- Dashboard with analytics
- Real-time collaboration features

## Found a Bug?

Open an issue on GitHub. I'm usually pretty responsive and happy to discuss improvements or fix problems.

## License

MIT - Feel free to use this for whatever you need.

---

Built with care by someone who thinks software should be both functional *and* delightful to use.
