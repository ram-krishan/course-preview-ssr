import gql from 'graphql-tag';

const CREATE_USER_ACTIVITY_LOG = gql`
  mutation CreateUserActivityLog($targetUrl: String!) {
    createUserActivityLog(
      input: {
        targetUrl: $targetUrl,
      }
    ) {
      errorMessages
      success
    }
  }
`;

export {
  CREATE_USER_ACTIVITY_LOG,
};
