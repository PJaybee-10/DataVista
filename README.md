# DataVista - Employee Management System

A full-stack employee management application with GraphQL backend and React frontend.

## 🚀 Live Demo

- **Frontend**: [Deployed URL will be here]
- **Backend API**: [Deployed URL will be here]
- **GitHub**: https://github.com/PJaybee-10/DataVista

## 🔐 Demo Credentials

- **Admin**: admin@datavista.com / admin123
- **Employee**: employee@datavista.com / employee123

## ✨ Features

### Backend
- ✅ GraphQL API with Apollo Server
- ✅ PostgreSQL database with Prisma ORM  
- ✅ JWT-based authentication & authorization
- ✅ Role-based access control (Admin & Employee)
- ✅ Pagination, filtering, and sorting
- ✅ Employee data: age, class, subjects, attendance
- ✅ Task management with priorities
- ✅ Attendance tracking

### Frontend
- ✅ Modern React with TypeScript
- ✅ Responsive UI with TailwindCSS & Framer Motion
- ✅ Hamburger menu with sub-menus
- ✅ Horizontal navigation menu
- ✅ Grid and Tile view modes (toggle)
- ✅ Detailed employee view
- ✅ Bun button menu (edit, flag, delete)
- ✅ Task completion tracking
- ✅ Attendance visualization
- ✅ Search and filter employees

## 🛠️ Tech Stack

**Backend:** Node.js, TypeScript, Apollo Server, GraphQL, Prisma, PostgreSQL, JWT, bcryptjs

**Frontend:** React 19, TypeScript, Apollo Client, TailwindCSS, Framer Motion, Zustand, Lucide Icons

## 📦 Local Development

### Prerequisites
- Node.js >= 18
- PostgreSQL
- pnpm

### Backend Setup
```bash
cd backend
pnpm install

# Configure .env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/datavista"
JWT_SECRET="your-secret-key"

# Setup database
pnpm prisma:generate
pnpm prisma migrate dev
pnpm prisma:seed

# Start server (http://localhost:4000)
pnpm dev
```

### Frontend Setup
```bash
cd frontend
pnpm install

# Start dev server (http://localhost:5173)
pnpm dev
```

## 🌐 API Examples

### Login
```graphql
mutation {
  login(email: "admin@datavista.com", password: "admin123") {
    token
    user { id email role }
  }
}
```

### Get Employees
```graphql
query {
  employees(limit: 10, offset: 0) {
    edges {
      id name age class position subjects
      tasks { title completed }
    }
    totalCount
    hasNextPage
  }
}
```

## 📋 Project Requirements ✅

All requirements have been implemented:

- ✅ Hamburger menu with one-level deep submenus
- ✅ Horizontal menu with sample items
- ✅ Beautiful grid view (10 columns of employee data)
- ✅ Tile view showing necessary fields only
- ✅ Bun button for edit, flag, delete options
- ✅ Click tile to see full employee details
- ✅ Navigate back from expanded view
- ✅ GraphQL API with authentication
- ✅ Employee data model with all required fields
- ✅ Queries with filters, pagination, sorting
- ✅ Mutations for add/update operations
- ✅ Role-based authorization (Admin/Employee)
- ✅ Performance optimizations (caching, lazy loading)

## 📝 License

MIT
