import gql from 'graphql-tag';

const UPDATE_USER_PROFILE_DETAIL = gql`
  mutation updateUserProfileDetail ($vibCourseId: ID!) {
    updateUserProfileDetail(input: { vibCourseId: $vibCourseId }) {
      errorMessages
      success
    }
  }
`;

export { UPDATE_USER_PROFILE_DETAIL };
