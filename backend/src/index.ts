import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import {
  hashPassword,
  comparePassword,
  generateToken,
  getAuthContext,
  requireAuth,
  requireAdmin,
  AuthContext,
} from './auth.js';

const prisma = new PrismaClient();

// GraphQL Type Definitions
const typeDefs = `#graphql
  enum Role {
    ADMIN
    EMPLOYEE
  }

  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
    LEAVE
  }

  type User {
    id: Int!
    email: String!
    role: Role!
    employee: Employee
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    id: Int!
    name: String!
    email: String!
    age: Int!
    class: String!
    subjects: [String!]!
    department: String
    position: String!
    avatar: String!
    phone: String
    address: String
    joinDate: String!
    salary: Float
    tasks: [Task!]!
    attendance: [AttendanceRecord!]!
    flagged: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Task {
    id: Int!
    title: String!
    description: String
    completed: Boolean!
    priority: String!
    dueDate: String
    employee: Employee!
    employeeId: Int!
    createdAt: String!
    updatedAt: String!
  }

  type AttendanceRecord {
    id: Int!
    employee: Employee!
    employeeId: Int!
    date: String!
    status: AttendanceStatus!
    checkIn: String
    checkOut: String
    notes: String
    createdAt: String!
  }

  type EmployeeConnection {
    edges: [Employee!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  input EmployeeFilterInput {
    name: String
    department: String
    position: String
    class: String
    flagged: Boolean
  }

  input EmployeeSortInput {
    field: String!
    order: String!
  }

  type Query {
    # Public/Employee accessible
    me: User
    
    # Employee list with pagination, filtering, sorting
    employees(
      limit: Int
      offset: Int
      filter: EmployeeFilterInput
      sort: EmployeeSortInput
    ): EmployeeConnection!
    
    employee(id: Int!): Employee
    
    # Tasks
    tasks(employeeId: Int, limit: Int, offset: Int): [Task!]!
    task(id: Int!): Task
    
    # Attendance
    attendance(employeeId: Int!, startDate: String, endDate: String): [AttendanceRecord!]!
  }

  type Mutation {
    # Authentication
    register(email: String!, password: String!, role: Role): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # Employee Management (Admin only for create/delete, Employee can update own)
    addEmployee(
      name: String!
      email: String!
      age: Int!
      class: String!
      subjects: [String!]!
      department: String
      position: String!
      avatar: String!
      phone: String
      address: String
      salary: Float
    ): Employee!
    
    updateEmployee(
      id: Int!
      name: String
      age: Int
      class: String
      subjects: [String!]
      department: String
      position: String
      avatar: String
      phone: String
      address: String
      salary: Float
    ): Employee!
    
    deleteEmployee(id: Int!): Employee!
    
    flagEmployee(id: Int!, flagged: Boolean!): Employee!
    
    # Task Management
    addTask(
      title: String!
      description: String
      completed: Boolean
      priority: String
      dueDate: String
      employeeId: Int!
    ): Task!
    
    updateTask(
      id: Int!
      title: String
      description: String
      completed: Boolean
      priority: String
      dueDate: String
    ): Task!
    
    deleteTask(id: Int!): Task!
    
    # Attendance Management
    recordAttendance(
      employeeId: Int!
      date: String!
      status: AttendanceStatus!
      checkIn: String
      checkOut: String
      notes: String
    ): AttendanceRecord!
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    me: async (_: any, __: any, context: AuthContext) => {
      requireAuth(context);
      return await prisma.user.findUnique({
        where: { id: context.userId },
        include: { employee: true },
      });
    },

    employees: async (
      _: any,
      {
        limit = 10,
        offset = 0,
        filter,
        sort,
      }: {
        limit?: number;
        offset?: number;
        filter?: any;
        sort?: { field: string; order: string };
      },
      context: AuthContext
    ) => {
      requireAuth(context);

      const where: any = {};
      if (filter) {
        if (filter.name) {
          where.name = { contains: filter.name, mode: 'insensitive' };
        }
        if (filter.department) {
          where.department = filter.department;
        }
        if (filter.position) {
          where.position = filter.position;
        }
        if (filter.class) {
          where.class = filter.class;
        }
        if (filter.flagged !== undefined) {
          where.flagged = filter.flagged;
        }
      }

      const orderBy: any = {};
      if (sort) {
        orderBy[sort.field] = sort.order.toLowerCase();
      } else {
        orderBy.id = 'asc';
      }

      const [employees, totalCount] = await Promise.all([
        prisma.employee.findMany({
          where,
          orderBy,
          take: limit,
          skip: offset,
          include: {
            tasks: true,
            attendance: {
              take: 5,
              orderBy: { date: 'desc' },
            },
          },
        }),
        prisma.employee.count({ where }),
      ]);

      return {
        edges: employees,
        totalCount,
        hasNextPage: offset + limit < totalCount,
      };
    },

    employee: async (_: any, { id }: { id: number }, context: AuthContext) => {
      requireAuth(context);
      return await prisma.employee.findUnique({
        where: { id },
        include: {
          tasks: true,
          attendance: {
            orderBy: { date: 'desc' },
            take: 30,
          },
        },
      });
    },

    tasks: async (
      _: any,
      { employeeId, limit = 50, offset = 0 }: { employeeId?: number; limit?: number; offset?: number },
      context: AuthContext
    ) => {
      requireAuth(context);
      return await prisma.task.findMany({
        where: employeeId ? { employeeId } : {},
        include: { employee: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    },

    task: async (_: any, { id }: { id: number }, context: AuthContext) => {
      requireAuth(context);
      return await prisma.task.findUnique({
        where: { id },
        include: { employee: true },
      });
    },

    attendance: async (
      _: any,
      {
        employeeId,
        startDate,
        endDate,
      }: {
        employeeId: number;
        startDate?: string;
        endDate?: string;
      },
      context: AuthContext
    ) => {
      requireAuth(context);
      const where: any = { employeeId };

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
      }

      return await prisma.attendanceRecord.findMany({
        where,
        include: { employee: true },
        orderBy: { date: 'desc' },
      });
    },
  },

  Mutation: {
    register: async (
      _: any,
      { email, password, role = 'EMPLOYEE' }: { email: string; password: string; role?: 'ADMIN' | 'EMPLOYEE' }
    ) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });

      const token = generateToken(user.id, user.role);
      return { token, user };
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await comparePassword(password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user.id, user.role);
      return { token, user };
    },

    addEmployee: async (_: any, args: any, context: AuthContext) => {
      requireAdmin(context);

      const employee = await prisma.employee.create({
        data: {
          name: args.name,
          email: args.email,
          age: args.age,
          class: args.class,
          subjects: args.subjects,
          department: args.department,
          position: args.position,
          avatar: args.avatar,
          phone: args.phone,
          address: args.address,
          salary: args.salary,
        },
        include: {
          tasks: true,
          attendance: true,
        },
      });

      return employee;
    },

    updateEmployee: async (_: any, args: any, context: AuthContext) => {
      requireAuth(context);

      // Employees can only update their own record, admins can update any
      if (context.role !== 'ADMIN') {
        const employee = await prisma.employee.findUnique({ where: { id: args.id } });
        if (employee?.userId !== context.userId) {
          throw new Error('Unauthorized');
        }
      }

      const data: any = {};
      if (args.name) data.name = args.name;
      if (args.age) data.age = args.age;
      if (args.class) data.class = args.class;
      if (args.subjects) data.subjects = args.subjects;
      if (args.department) data.department = args.department;
      if (args.position) data.position = args.position;
      if (args.avatar) data.avatar = args.avatar;
      if (args.phone) data.phone = args.phone;
      if (args.address) data.address = args.address;
      if (args.salary !== undefined && context.role === 'ADMIN') data.salary = args.salary;

      return await prisma.employee.update({
        where: { id: args.id },
        data,
        include: {
          tasks: true,
          attendance: true,
        },
      });
    },

    deleteEmployee: async (_: any, { id }: { id: number }, context: AuthContext) => {
      requireAdmin(context);
      return await prisma.employee.delete({
        where: { id },
        include: {
          tasks: true,
          attendance: true,
        },
      });
    },

    flagEmployee: async (_: any, { id, flagged }: { id: number; flagged: boolean }, context: AuthContext) => {
      requireAdmin(context);
      return await prisma.employee.update({
        where: { id },
        data: { flagged },
        include: {
          tasks: true,
          attendance: true,
        },
      });
    },

    addTask: async (_: any, args: any, context: AuthContext) => {
      requireAuth(context);

      return await prisma.task.create({
        data: {
          title: args.title,
          description: args.description,
          completed: args.completed ?? false,
          priority: args.priority ?? 'medium',
          dueDate: args.dueDate ? new Date(args.dueDate) : null,
          employeeId: args.employeeId,
        },
        include: { employee: true },
      });
    },

    updateTask: async (_: any, args: any, context: AuthContext) => {
      requireAuth(context);

      const data: any = {};
      if (args.title) data.title = args.title;
      if (args.description !== undefined) data.description = args.description;
      if (args.completed !== undefined) data.completed = args.completed;
      if (args.priority) data.priority = args.priority;
      if (args.dueDate !== undefined) data.dueDate = args.dueDate ? new Date(args.dueDate) : null;

      return await prisma.task.update({
        where: { id: args.id },
        data,
        include: { employee: true },
      });
    },

    deleteTask: async (_: any, { id }: { id: number }, context: AuthContext) => {
      requireAuth(context);
      return await prisma.task.delete({
        where: { id },
        include: { employee: true },
      });
    },

    recordAttendance: async (_: any, args: any, context: AuthContext) => {
      requireAdmin(context);

      return await prisma.attendanceRecord.upsert({
        where: {
          employeeId_date: {
            employeeId: args.employeeId,
            date: new Date(args.date),
          },
        },
        update: {
          status: args.status,
          checkIn: args.checkIn ? new Date(args.checkIn) : null,
          checkOut: args.checkOut ? new Date(args.checkOut) : null,
          notes: args.notes,
        },
        create: {
          employeeId: args.employeeId,
          date: new Date(args.date),
          status: args.status,
          checkIn: args.checkIn ? new Date(args.checkIn) : null,
          checkOut: args.checkOut ? new Date(args.checkOut) : null,
          notes: args.notes,
        },
        include: { employee: true },
      });
    },
  },

  Employee: {
    tasks: async (parent: any) => {
      return await prisma.task.findMany({
        where: { employeeId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
    attendance: async (parent: any) => {
      return await prisma.attendanceRecord.findMany({
        where: { employeeId: parent.id },
        orderBy: { date: 'desc' },
        take: 30,
      });
    },
  },

  Task: {
    employee: async (parent: any) => {
      return await prisma.employee.findUnique({
        where: { id: parent.employeeId },
      });
    },
  },

  AttendanceRecord: {
    employee: async (parent: any) => {
      return await prisma.employee.findUnique({
        where: { id: parent.employeeId },
      });
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const authHeader = req.headers.authorization;
      return getAuthContext(authHeader);
    },
  });

  console.log(`🚀 Server ready at: ${url}`);
  console.log(`📊 GraphQL Playground: ${url}`);
  console.log('\n🔐 Authentication enabled - Use JWT tokens in Authorization header');
  console.log('\n📝 Example Usage:');
  console.log(`
  # 1. Register a new user (default role: EMPLOYEE)
  mutation {
    register(email: "admin@datavista.com", password: "admin123", role: ADMIN) {
      token
      user {
        id
        email
        role
      }
    }
  }

  # 2. Login
  mutation {
    login(email: "admin@datavista.com", password: "admin123") {
      token
      user {
        id
        email
        role
      }
    }
  }

  # 3. Fetch employees with pagination and filters (requires auth)
  # Add header: Authorization: Bearer <your-token>
  query {
    employees(limit: 10, offset: 0, filter: { department: "Engineering" }) {
      edges {
        id
        name
        age
        class
        subjects
        position
        department
        avatar
        tasks {
          id
          title
          completed
        }
        attendance {
          date
          status
        }
      }
      totalCount
      hasNextPage
    }
  }

  # 4. Get single employee with full details
  query {
    employee(id: 1) {
      id
      name
      email
      age
      class
      subjects
      position
      department
      avatar
      phone
      address
      salary
      flagged
      tasks {
        id
        title
        description
        completed
        priority
        dueDate
      }
      attendance {
        date
        status
        checkIn
        checkOut
      }
    }
  }
  `);
}

startServer().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});
