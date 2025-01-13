import gql from 'graphql-tag';

const LEAVE_PRACTICE_SESSION = gql`
  mutation leavePracticeSession (
    $coursePracticeSessionId: ID!
  ) {
    leavePracticeSession(
      input: {
        coursePracticeSessionId: $coursePracticeSessionId,
      }
    ) {
      errorMessages
      success
      course {
        id
        userActivityPoints
        completedPercentage
      }
    }
  }
`;

export { LEAVE_PRACTICE_SESSION };
