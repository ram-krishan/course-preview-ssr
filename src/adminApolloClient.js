import { ApolloClient } from 'apollo-client';

// https://github.com/rmosolgo/graphql-ruby/blob/master/guides/javascript_client/apollo_subscriptions.md
// ActionCableLink is the Link which we are using to call graphql subscription.
// TO know more about Apollo link please visit https://www.apollographql.com/docs/link

// Generally ActionCableLink is a link,
//  which we are using to route graphql subscriptions to GraphQLChannel
// here is the path for graphql Channel: app/channels/graphql_channel.rb
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import fetch from 'unfetch';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';

import {
  rootDefaults,
  rootResolvers,
  // flashMessageState,
} from './graphql_states';

import introspectionQueryResultData from './adminSchema';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});
export const cache = new InMemoryCache({
  fragmentMatcher,
  // when freezeResults is true we can not mutate the cache.
  //    can't directly assign/change the data to cache. it will raise error on browser console.
  freezeResults: true,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'X-CSRF-Token': localStorage.getItem('csrf')
  },
}));

const options = (graphQLEndpoint) => ({
  uri: graphQLEndpoint,
  credentials: 'include',
  withCredentials: true,
  fetch,
});

const onErrorHandler = ({ graphQLErrors, networkError }) => {
  // if (graphQLErrors) {
  //   graphQLErrors.forEach(({
  //     extensions,
  //     message,
  //     locations,
  //     path,
  //   }) => {
  //     if (extensions && extensions.errorCode === 401) {
  //       adminClient.clearStore();
  //       adminClient.resetStore();
  //     }
  //     console.log(
  //       `[AdminGraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
  //     );
  //   });
  // }
  // if (networkError) {
  //   if (networkError.statusCode === 401) {
  //     window.location.href = '/';
  //   }
  // }
};

const adminClient = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    onError(onErrorHandler),
    withClientState({
      defaults: rootDefaults,
      resolvers: rootResolvers,
      cache,
    }),
    createUploadLink(options(`${localStorage.getItem('baseURL')}${process.env.REACT_APP_ADMIN_GRAPHQL_ENDPOINT}`)),
  ]),
  cache,
});

const configureAuthLink = (authHeaders) => setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...authHeaders,
  },
}));

export const configureClient = (authHeaders, graphQLEndpoint) => new ApolloClient({
  link: ApolloLink.from([
    configureAuthLink(authHeaders),
    onError(onErrorHandler),
    withClientState({
      defaults: rootDefaults,
      resolvers: rootResolvers,
      cache,
    }),
    createUploadLink(graphQLEndpoint),
  ]),
  cache,
});

export default adminClient;


