import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { API_URL, TOKEN_KEY } from '../config/constants';

// HTTP Link
const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'same-origin',
});

// Auth Link - adds JWT token to requests
const authLink = setContext((_, { headers }) => {
  const authStorage = localStorage.getItem(TOKEN_KEY);
  let token = null;
  
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      token = parsed.state?.token;
    } catch (error) {
      console.error('Error parsing auth storage:', error);
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link - handles GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle authentication errors
      if (message.includes('Authentication required') || message.includes('Invalid credentials')) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/';
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          employees: {
            // Merge pagination results
            keyArgs: ['filter', 'sort'],
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
