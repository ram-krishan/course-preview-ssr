import gql from 'graphql-tag';

const SIGN_OUT = gql`
  mutation SessionSignOut {
    signOutUser(input: {})
      @rest(path: "/sessions.json", method: "DELETE", type: "signOutUser") {
      message
    }
  }
`;

const DELETE_USER_SESSION = gql`
  mutation deleteUserSession($id: ID!) {
    deleteUserSession(input: {id: $id}) {
      errorMessages
      userSession {
        id
      }
    }
  }
`;

export {
  SIGN_OUT,
  DELETE_USER_SESSION,
};
