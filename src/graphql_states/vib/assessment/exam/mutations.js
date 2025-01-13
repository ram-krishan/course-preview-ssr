import gql from 'graphql-tag';

const CREATE_ASSESSMENT_EXAM_USER_ANSWER = gql`
  mutation createAssessmentExamUserAnswer (
    $vibCourseId: ID!
    $vibExamQuestionId: ID!
    $vibAnswerId: ID!
    $vibAssessmentAttemptId: ID!
    $assessmentAttemptType: AssessmentTypeEnum!
  ) {
    createAssessmentExamUserAnswer(
      input: {
        vibCourseId: $vibCourseId,
        vibExamQuestionId: $vibExamQuestionId,
        vibAnswerId: $vibAnswerId,
        vibAssessmentAttemptId: $vibAssessmentAttemptId,
      }
    ) {
      errorMessages
      success
      showStatusPage
      assessmentExam {
        id
        percentageOfQuestionCompleted(vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId)
      }
      courseAssessmentAttempt(
        vibCourseId: $vibCourseId,
        vibAssessmentAttemptId: $vibAssessmentAttemptId,
      ) {
        id
        totalNoOfQuestions
        totalCompletedQuestions
        assessmentType
        courseAssessment {
          id
          assessment {
            id
            isAllExamCompleted(vibCourseId: $vibCourseId, attemptState: $assessmentAttemptType)
          }
        }
      }
      course {
        id
        userActivityPoints
        completedPercentage
      }
    }
  }
`;

export {
  CREATE_ASSESSMENT_EXAM_USER_ANSWER,
};
