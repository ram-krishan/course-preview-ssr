import gql from 'graphql-tag';

const CREATE_USER_COURSE_GOALS = gql`
  mutation createUserCourseGoals (
    $vibCourseId: ID!
    $vibGoalIds: [ID!]!
  ) {
    createUserCourseGoals(
      input: {
        vibCourseId: $vibCourseId,
        vibGoalIds: $vibGoalIds,
      }
    ) {
      errorMessages
      success
      course {
        id
        selectedGoals {
          id
          title
        }
      }
    }
  }
`;

export { CREATE_USER_COURSE_GOALS };
