import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.attendanceRecord.deleteMany();
  await prisma.task.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@datavista.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  // Create employee user
  const employeeUser = await prisma.user.create({
    data: {
      email: 'employee@datavista.com',
      password: await bcrypt.hash('employee123', 10),
      role: 'EMPLOYEE',
    },
  });

  console.log('✅ Created users:');
  console.log('   Admin: admin@datavista.com / admin123');
  console.log('   Employee: employee@datavista.com / employee123');

  // Create employees with comprehensive data
  const employee1 = await prisma.employee.create({
    data: {
      userId: employeeUser.id,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@datavista.com',
      age: 28,
      class: 'Senior',
      subjects: ['TypeScript', 'React', 'Node.js', 'GraphQL'],
      department: 'Engineering',
      position: 'Senior Software Engineer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      phone: '+1-555-0101',
      address: '123 Tech Street, San Francisco, CA',
      salary: 125000,
      tasks: {
        create: [
          {
            title: 'Implement authentication system',
            description: 'Set up JWT-based authentication with role-based access control',
            completed: true,
            priority: 'high',
            dueDate: new Date('2024-11-15'),
          },
          {
            title: 'Code review PR #456',
            description: 'Review and approve pending pull request for new features',
            completed: false,
            priority: 'medium',
            dueDate: new Date('2024-12-10'),
          },
          {
            title: 'Optimize database queries',
            description: 'Improve performance by adding indexes and optimizing queries',
            completed: false,
            priority: 'high',
            dueDate: new Date('2024-12-05'),
          },
        ],
      },
      attendance: {
        create: [
          {
            date: new Date('2024-11-25'),
            status: 'PRESENT',
            checkIn: new Date('2024-11-25T09:00:00'),
            checkOut: new Date('2024-11-25T17:30:00'),
          },
          {
            date: new Date('2024-11-26'),
            status: 'PRESENT',
            checkIn: new Date('2024-11-26T08:45:00'),
            checkOut: new Date('2024-11-26T17:15:00'),
          },
          {
            date: new Date('2024-11-27'),
            status: 'LATE',
            checkIn: new Date('2024-11-27T10:30:00'),
            checkOut: new Date('2024-11-27T18:00:00'),
            notes: 'Medical appointment in morning',
          },
        ],
      },
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      name: 'Michael Chen',
      email: 'michael.chen@datavista.com',
      age: 35,
      class: 'Principal',
      subjects: ['Product Strategy', 'Agile', 'Leadership', 'Analytics'],
      department: 'Product',
      position: 'Product Manager',
      avatar: 'https://i.pravatar.cc/150?img=2',
      phone: '+1-555-0102',
      address: '456 Innovation Ave, San Francisco, CA',
      salary: 140000,
      tasks: {
        create: [
          {
            title: 'Q1 Product Roadmap',
            description: 'Define and prioritize features for Q1 2025',
            completed: false,
            priority: 'high',
            dueDate: new Date('2024-12-15'),
          },
          {
            title: 'Stakeholder Presentation',
            description: 'Present new features to executive team',
            completed: true,
            priority: 'high',
            dueDate: new Date('2024-11-20'),
          },
        ],
      },
      attendance: {
        create: [
          {
            date: new Date('2024-11-25'),
            status: 'PRESENT',
            checkIn: new Date('2024-11-25T09:15:00'),
            checkOut: new Date('2024-11-25T18:00:00'),
          },
          {
            date: new Date('2024-11-26'),
            status: 'LEAVE',
            notes: 'Planned vacation',
          },
        ],
      },
    },
  });

  const employee3 = await prisma.employee.create({
    data: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@datavista.com',
      age: 26,
      class: 'Mid-Level',
      subjects: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
      department: 'Design',
      position: 'UX Designer',
      avatar: 'https://i.pravatar.cc/150?img=3',
      phone: '+1-555-0103',
      address: '789 Creative Blvd, San Francisco, CA',
      salary: 95000,
      flagged: true,
      tasks: {
        create: [
          {
            title: 'Dashboard Redesign',
            description: 'Create modern wireframes for analytics dashboard',
            completed: false,
            priority: 'medium',
            dueDate: new Date('2024-12-20'),
          },
          {
            title: 'User Research Study',
            description: 'Conduct interviews with 10 users about new features',
            completed: false,
            priority: 'high',
            dueDate: new Date('2024-12-08'),
          },
        ],
      },
      attendance: {
        create: [
          {
            date: new Date('2024-11-25'),
            status: 'PRESENT',
            checkIn: new Date('2024-11-25T09:00:00'),
            checkOut: new Date('2024-11-25T17:00:00'),
          },
        ],
      },
    },
  });

  const employee4 = await prisma.employee.create({
    data: {
      name: 'David Park',
      email: 'david.park@datavista.com',
      age: 32,
      class: 'Senior',
      subjects: ['Python', 'Machine Learning', 'Statistics', 'TensorFlow'],
      department: 'Data Science',
      position: 'Data Scientist',
      avatar: 'https://i.pravatar.cc/150?img=4',
      phone: '+1-555-0104',
      address: '321 Data Drive, San Francisco, CA',
      salary: 135000,
      tasks: {
        create: [
          {
            title: 'ML Model Training',
            description: 'Improve prediction model accuracy to 95%+',
            completed: false,
            priority: 'high',
            dueDate: new Date('2024-12-12'),
          },
          {
            title: 'Monthly Analytics Report',
            description: 'Generate and present November analytics',
            completed: true,
            priority: 'medium',
            dueDate: new Date('2024-11-30'),
          },
        ],
      },
      attendance: {
        create: [
          {
            date: new Date('2024-11-25'),
            status: 'PRESENT',
            checkIn: new Date('2024-11-25T08:30:00'),
            checkOut: new Date('2024-11-25T17:45:00'),
          },
          {
            date: new Date('2024-11-26'),
            status: 'PRESENT',
            checkIn: new Date('2024-11-26T09:00:00'),
            checkOut: new Date('2024-11-26T18:00:00'),
          },
        ],
      },
    },
  });

  const employee5 = await prisma.employee.create({
    data: {
      name: 'Jessica Williams',
      email: 'jessica.williams@datavista.com',
      age: 30,
      class: 'Senior',
      subjects: ['Marketing Strategy', 'SEO', 'Content Marketing', 'Analytics'],
      department: 'Marketing',
      position: 'Marketing Director',
      avatar: 'https://i.pravatar.cc/150?img=5',
      phone: '+1-555-0105',
      address: '654 Marketing Lane, San Francisco, CA',
      salary: 115000,
      tasks: {
        create: [
          {
            title: 'Q4 Campaign Launch',
            description: 'Coordinate and execute end-of-year marketing campaign',
            completed: false,
            priority: 'high',
            dueDate: new Date('2024-12-18'),
          },
          {
            title: 'Social Media Strategy',
            description: 'Develop 2025 social media content calendar',
            completed: false,
            priority: 'low',
            dueDate: new Date('2024-12-22'),
          },
        ],
      },
      attendance: {
        create: [
          {
            date: new Date('2024-11-25'),
            status: 'PRESENT',
            checkIn: new Date('2024-11-25T09:00:00'),
            checkOut: new Date('2024-11-25T17:30:00'),
          },
          {
            date: new Date('2024-11-26'),
            status: 'ABSENT',
            notes: 'Sick leave',
          },
        ],
      },
    },
  });

  const employee6 = await prisma.employee.create({
    data: {
      name: 'Alex Thompson',
      email: 'alex.thompson@datavista.com',
      age: 24,
      class: 'Junior',
      subjects: ['JavaScript', 'HTML', 'CSS', 'React'],
      department: 'Engineering',
      position: 'Frontend Developer',
      avatar: 'https://i.pravatar.cc/150?img=6',
      phone: '+1-555-0106',
      address: '987 Code Street, San Francisco, CA',
      salary: 85000,
      tasks: {
        create: [
          {
            title: 'Build responsive components',
            description: 'Create reusable UI components for the design system',
            completed: false,
            priority: 'medium',
            dueDate: new Date('2024-12-14'),
          },
        ],
      },
      attendance: {
        create: [
          {
            date: new Date('2024-11-25'),
            status: 'PRESENT',
            checkIn: new Date('2024-11-25T09:00:00'),
            checkOut: new Date('2024-11-25T17:00:00'),
          },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.employee.count()} employees`);
  console.log(`Created ${await prisma.task.count()} tasks`);
  console.log(`Created ${await prisma.attendanceRecord.count()} attendance records`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
