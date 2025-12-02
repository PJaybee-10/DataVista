import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
  const authStorage = localStorage.getItem('auth-storage');
  let token = null;
  
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      token = parsed.state?.token;
    } catch (e) {
      console.error('Error parsing auth storage:', e);
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
