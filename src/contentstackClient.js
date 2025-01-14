import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import fetch from 'unfetch';

import introspectionQueryResultData from './coursePreviewSchema';

const buildUrl = () => (
  `${process.env.REACT_APP_CONTENT_STACK_GQL_ENDPOINT}/stacks/${process.env.REACT_APP_CONTENT_STACK_GQL_API_KEY}?environment=${process.env.REACT_APP_CONTENT_STACK_GQL_ENVIRONMENT}`
);

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({
  fragmentMatcher,
  // when freezeResults is true we can not mutate the cache.
  // can't directly assign/change the data to cache. it will raise error on browser console.
  freezeResults: true,
});

const link = new HttpLink({
  uri: buildUrl(),
  headers: {
    access_token: process.env.REACT_APP_CONTENT_STACK_GQL_DELIVERY_TOKEN,
  },
  fetch,
});
const client = new ApolloClient({
  link: ApolloLink.from([link]),
  cache,
});
export default client;
