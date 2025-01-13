import gql from 'graphql-tag';

const GET_REDIRECTION_DATA = gql`
  {
    redirectUrl @client
    redirected @client
  }
`;

export { GET_REDIRECTION_DATA };
