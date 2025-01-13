import gql from 'graphql-tag';

const START_ASSESSMENT_ATTEMPT = gql`
  mutation StartAssessmentAttempt (
    $vibCourseId: ID!
    $vibExamId: ID!
    $assessmentAttemptType: AssessmentTypeEnum!,
  ) {
    startAssessmentAttempt(
      input: {
        vibCourseId: $vibCourseId,
        vibExamId: $vibExamId,
        assessmentAttemptType: $assessmentAttemptType,
      }
    ) {
      errorMessages
      success
      assessmentAttemptId
    }
  }
`;

const CREATE_USER_ASSESSMENT_PROGRESS_STATUS = gql`
  mutation createUserAssessmentProgressStatus (
    $vibCourseId: ID!
    $vibAssessmentAttemptId: ID!,
  ) {
    createUserAssessmentProgressStatus(
      input: {
        vibCourseId: $vibCourseId,
        vibAssessmentAttemptId: $vibAssessmentAttemptId,
      }
    ) {
      errorMessages
      success
    }
  }
`;

export {
  START_ASSESSMENT_ATTEMPT,
  CREATE_USER_ASSESSMENT_PROGRESS_STATUS,
};
