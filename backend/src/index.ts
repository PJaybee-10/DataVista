import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { getAuthContext } from './auth.js';
import type { AuthContext } from './types.js';

// Environment validation
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Initialize Prisma Client with conditional logging
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Create Apollo Server with error formatting
const server = new ApolloServer<AuthContext>({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('GraphQL Error:', error);
    }
    
    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production' && error.message.includes('prisma')) {
      return new Error('Internal server error');
    }
    
    return error;
  },
});

// Start server with database connection and graceful shutdown
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const { url } = await startStandaloneServer(server, {
      listen: { port: Number(process.env.PORT) || 4000 },
      context: async ({ req }): Promise<AuthContext> => {
        const authHeader = req.headers.authorization;
        const authContext = getAuthContext(authHeader);
        return {
          ...authContext,
          prisma,
        };
      },
    });

    console.log('\n🚀 Server ready at:', url);
    console.log('📊 GraphQL Playground:', url);
    console.log('\n🔐 Authentication: JWT-based with role-based access control');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development\n');

    // Graceful shutdown handlers
    process.on('SIGINT', async () => {
      console.log('\n⏳ Shutting down gracefully...');
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n⏳ Shutting down gracefully...');
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
