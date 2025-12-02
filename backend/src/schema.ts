export const typeDefs = `#graphql
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
    me: User
    employees(
      limit: Int
      offset: Int
      filter: EmployeeFilterInput
      sort: EmployeeSortInput
    ): EmployeeConnection!
    employee(id: Int!): Employee
    tasks(employeeId: Int, limit: Int, offset: Int): [Task!]!
    task(id: Int!): Task
    attendance(employeeId: Int!, startDate: String, endDate: String): [AttendanceRecord!]!
  }

  type Mutation {
    register(email: String!, password: String!, role: Role): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
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
