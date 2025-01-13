import gql from 'graphql-tag';

const CREATE_PRACTICE_QUESTION_ANSWER = gql`
  mutation submitPracticeQuestionAnswer (
    $userCoursePracticeId: ID!
    $practiceQuestionId: ID!
    $vibAnswerIds: [ID!]!
    $confidenceOfResponseAnswerId: ID!
    $coursePracticeSessionId: ID
    $takingAllCategories: Boolean
  ) {
    submitPracticeQuestionAnswer(
      input: {
        userCoursePracticeId: $userCoursePracticeId,
        practiceQuestionId: $practiceQuestionId,
        vibAnswerIds: $vibAnswerIds,
        confidenceOfResponseAnswerId: $confidenceOfResponseAnswerId,
        coursePracticeSessionId: $coursePracticeSessionId,
        takingAllCategories: $takingAllCategories,
      }
    ) {
      errorMessages
      success
      levelOneCollectionLink
      showLevelOneCollectonLink
      coursePracticeSession {
        id
        points
        userCoursePractice {
          id
          streakCount
          totalActivityPoints
          user {
            id
          }
          course {
            id
            userActivityPoints
            completedPercentage
          }
        }
      }
    }
  }
`;

export { CREATE_PRACTICE_QUESTION_ANSWER };
