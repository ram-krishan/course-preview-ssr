import gql from 'graphql-tag';

const GET_AVAILABLE_LANGUAGES = gql`
  query UserGetAvailablelanguages {
    availableLanguages {
      value: code
      label: name
    }
  }
`;

const GET_BREADCRUMB = gql`
  query UserGetBreadcrumb($userId: ID!) {
    breadcrumb(userId: $userId) {
      id
      fullName
    }
  }
`;

const GET_USER_INFO = gql`
  query UserGetUserInfo($userId: ID!) {
    user(id: $userId) {
      id
      fullName
      managerUserId
    }
  }
`;

export { GET_AVAILABLE_LANGUAGES, GET_BREADCRUMB, GET_USER_INFO };
