import { ApolloClient } from 'apollo-client';
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

import { rootDefaults, rootResolvers } from './graphql_states';
import introspectionQueryResultData from './previewSchema';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const cache = new InMemoryCache({
  fragmentMatcher,
  freezeResults: true,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-admin-api-token': process.env.JS_ADMIN_API_TOKEN,
    'X-CSRF-Token': document.head.querySelector("[name~='csrf-token'][content]")
      .content,
  },
}));

const options = (graphQLEndpoint) => ({
  uri: graphQLEndpoint,
  credentials: 'include',
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

const previewClient = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    onError(onErrorHandler),
    withClientState({
      defaults: rootDefaults,
      resolvers: rootResolvers,
      cache,
    }),
    createUploadLink(options(process.env.JS_PREVIEW_GRAPHQL_ENDPOINT)),
  ]),
  cache,
});

// const configureAuthLink = (authHeaders) => setContext((_, { headers }) => ({
//   headers: {
//     ...headers,
//     ...authHeaders,
//     // need to read from meta data.
//     'X-CSRF-Token': document.head.querySelector(
//       "[name~='csrf-token'][content]",
//     ).content,
//   },
// }));

// export const configureClient = (authHeaders, graphQLEndpoint) => new ApolloClient({
//   link: ApolloLink.from([
//     configureAuthLink(authHeaders),
//     onError(onErrorHandler),
//     withClientState({
//       defaults: rootDefaults,
//       resolvers: rootResolvers,
//       cache,
//     }),
//     createUploadLink(graphQLEndpoint),
//   ]),
//   cache,
// });

export default previewClient;
