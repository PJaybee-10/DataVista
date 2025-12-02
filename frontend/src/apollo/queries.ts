import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees($limit: Int, $offset: Int, $filter: EmployeeFilterInput, $sort: EmployeeSortInput) {
    employees(limit: $limit, offset: $offset, filter: $filter, sort: $sort) {
      edges {
        id
        name
        email
        age
        class
        subjects
        department
        position
        avatar
        phone
        address
        flagged
        tasks {
          id
          title
          completed
          priority
        }
        attendance {
          id
          date
          status
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: Int!) {
    employee(id: $id) {
      id
      name
      email
      age
      class
      subjects
      department
      position
      avatar
      phone
      address
      joinDate
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
        id
        date
        status
        checkIn
        checkOut
        notes
      }
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: Int!
    $name: String
    $age: Int
    $class: String
    $subjects: [String!]
    $department: String
    $position: String
    $avatar: String
    $phone: String
    $address: String
  ) {
    updateEmployee(
      id: $id
      name: $name
      age: $age
      class: $class
      subjects: $subjects
      department: $department
      position: $position
      avatar: $avatar
      phone: $phone
      address: $address
    ) {
      id
      name
      email
      age
    }
  }
`;

export const FLAG_EMPLOYEE = gql`
  mutation FlagEmployee($id: Int!, $flagged: Boolean!) {
    flagEmployee(id: $id, flagged: $flagged) {
      id
      flagged
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: Int!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: Int!, $completed: Boolean) {
    updateTask(id: $id, completed: $completed) {
      id
      completed
    }
  }
`;
