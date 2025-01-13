import gql from 'graphql-tag';

const GET_USER_DETAILS = gql`
  query getUserDetails($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      fullName
      email
      managerName
      profilePictureUrl
      isManagerViewingProfile
      userProfile {
        id
        course {
          id
          title
          completedPercentage
          activityStatus(userId: $id)
          selectedGoals(userId: $id) {
            id
            title
          }
        }
      }
    }
  }
  `;

export { GET_USER_DETAILS };
