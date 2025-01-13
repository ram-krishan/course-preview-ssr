import gql from 'graphql-tag';

const GET_COURSE_ASSESSMENT_DATA = gql`
  query VibGetCourseAssessment(
    $vibCourseId: ID!,
    $assessmentAttemptType: AssessmentTypeEnum!
  ) {
  contentstackCourseAssessment(vibCourseId: $vibCourseId){
    id
    title
    isUserAllowedToTakeAssessment(assessmentAttemptType: $assessmentAttemptType, vibCourseId: $vibCourseId)
    userAssessmentAttempt(assessmentAttemptType: $assessmentAttemptType, vibCourseId: $vibCourseId) {
      id
    }
    totalNumOfExams
    totalMinutes
    instructionFirst(assessmentAttemptType: $assessmentAttemptType)
    instructionSecond(assessmentAttemptType: $assessmentAttemptType)
    numOfSections
    isAllExamCompleted(vibCourseId: $vibCourseId, attemptState: $assessmentAttemptType)
    assessmentAssessmentExams{
      id
      assessmentExam{
        image{
          id,
          url
        }
        id
        title
        status(vibCourseId: $vibCourseId, assessmentAttemptType: $assessmentAttemptType)
        estimatedTime
        summary
        isValid
      }
    }
  }
}
`;


const USER_COURSE_ASSESSMENT_STATUS = gql`
query userCourseAssessmentStatus(
  $vibCourseId: ID!
  $vibAssessmentAttemptId: ID!
) {
  userCourseAssessmentStatus(vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId){
    percentage
    canShowStatusPage
    progressStatus
  }
  contentstackCourseAssessment(vibCourseId: $vibCourseId){
    id
    title
    totalNumOfExams
    instruction
    isUserAllowedToTakeAssessment(vibAssessmentAttemptId: $vibAssessmentAttemptId, vibCourseId: $vibCourseId)
    userAssessmentAttempt(vibAssessmentAttemptId: $vibAssessmentAttemptId, vibCourseId: $vibCourseId) {
      id
      assessmentType
    }
    assessmentAssessmentExams{
      id
      assessmentExam{
        image{
          id,
          url
        }
        id
        title
        status(vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId)
        estimatedTime
        summary
        isValid
      }
    }
  }
}
`;

const GET_ASSESSMENT_RESULT = gql`
query courseAssessmentAttempt(
  $vibCourseId: ID!,
  $vibAssessmentAttemptId: ID!
) {
  courseAssessmentAttempt(
    vibCourseId: $vibCourseId,
    vibAssessmentAttemptId: $vibAssessmentAttemptId,
  ) {
    id
    totalNoOfQuestions
    totalCompletedQuestions
    overallScore
    assessmentType
    courseAssessment {
      id
      course {
        id
        title
      }
      assessment {
        id
        title
        assessmentAssessmentExams {
          id
          assessmentExam {
            id
            status(vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId)
          }
        }
        userAssessmentResult(vibAssessmentAttemptId: $vibAssessmentAttemptId) {
          id
          assessmentExamTitle
          percentage
          percentageDiffToBenchmark
          noOfQuestions
          performanceCategory
        }
      }
    }
  }
}
`;

const GET_COMPLETED_ASSESSMENT_EXAM_RESULT = gql`
query completedUserAssessmentExamResult(
  $vibAssessmentExamId: ID!,
  $vibCourseId: ID!,
  $vibAssessmentAttemptId: ID!
) {
    completedUserAssessmentExamResult(
      vibAssessmentExamId: $vibAssessmentExamId,
      vibCourseId: $vibCourseId,
      vibAssessmentAttemptId: $vibAssessmentAttemptId
    ) {
        id
        assessmentExamTitle
        percentage
        percentageDiffToBenchmark
        noOfQuestions
        performanceCategory
      }
}
`;

export {
  GET_COURSE_ASSESSMENT_DATA,
  USER_COURSE_ASSESSMENT_STATUS,
  GET_ASSESSMENT_RESULT,
  GET_COMPLETED_ASSESSMENT_EXAM_RESULT,
};
