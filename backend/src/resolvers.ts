import { PrismaClient } from '@prisma/client';
import {
  hashPassword,
  comparePassword,
  generateToken,
  requireAuth,
  requireAdmin,
} from './auth.js';
import type { AuthContext, EmployeeFilterInput, EmployeeSortInput } from './types.js';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: AuthContext) => {
      requireAuth(context);
      return await prisma.user.findUnique({
        where: { id: context.userId },
        include: { employee: true },
      });
    },

    employees: async (
      _: unknown,
      {
        limit = 10,
        offset = 0,
        filter,
        sort,
      }: {
        limit?: number;
        offset?: number;
        filter?: EmployeeFilterInput;
        sort?: EmployeeSortInput;
      },
      context: AuthContext
    ) => {
      requireAuth(context);

      const where: any = {};
      if (filter) {
        if (filter.name) where.name = { contains: filter.name, mode: 'insensitive' };
        if (filter.department) where.department = filter.department;
        if (filter.position) where.position = filter.position;
        if (filter.class) where.class = filter.class;
        if (filter.flagged !== undefined) where.flagged = filter.flagged;
      }

      const orderBy: any = sort
        ? { [sort.field]: sort.order.toLowerCase() }
        : { id: 'asc' };

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

    employee: async (_: unknown, { id }: { id: number }, context: AuthContext) => {
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
      _: unknown,
      {
        employeeId,
        limit = 50,
        offset = 0,
      }: { employeeId?: number; limit?: number; offset?: number },
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

    task: async (_: unknown, { id }: { id: number }, context: AuthContext) => {
      requireAuth(context);
      return await prisma.task.findUnique({
        where: { id },
        include: { employee: true },
      });
    },

    attendance: async (
      _: unknown,
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
      _: unknown,
      {
        email,
        password,
        role = 'EMPLOYEE',
      }: { email: string; password: string; role?: 'ADMIN' | 'EMPLOYEE' }
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

      const token = generateToken(user.id, user.role as 'ADMIN' | 'EMPLOYEE');
      return { token, user };
    },

    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await comparePassword(password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user.id, user.role as 'ADMIN' | 'EMPLOYEE');
      return { token, user };
    },

    addEmployee: async (_: unknown, args: any, context: AuthContext) => {
      requireAdmin(context);

      return await prisma.employee.create({
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
    },

    updateEmployee: async (_: unknown, args: any, context: AuthContext) => {
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

    deleteEmployee: async (_: unknown, { id }: { id: number }, context: AuthContext) => {
      requireAdmin(context);
      return await prisma.employee.delete({
        where: { id },
        include: {
          tasks: true,
          attendance: true,
        },
      });
    },

    flagEmployee: async (
      _: unknown,
      { id, flagged }: { id: number; flagged: boolean },
      context: AuthContext
    ) => {
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

    addTask: async (_: unknown, args: any, context: AuthContext) => {
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

    updateTask: async (_: unknown, args: any, context: AuthContext) => {
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

    deleteTask: async (_: unknown, { id }: { id: number }, context: AuthContext) => {
      requireAuth(context);
      return await prisma.task.delete({
        where: { id },
        include: { employee: true },
      });
    },

    recordAttendance: async (_: unknown, args: any, context: AuthContext) => {
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
