import gql from 'graphql-tag';

const GET_COURSE_USER_ASSESSMENT_EXAM_PROGRESS = gql`
  query VibGetAssessmentAttemptExamProgress (
    $vibCourseId: ID!,
    $vibAssessmentAttemptId: ID!,
    $locale: String!,
  ) {
    courseAssessmentAttempt(
      vibCourseId: $vibCourseId,
      vibAssessmentAttemptId: $vibAssessmentAttemptId,
      locale: $locale,
      fallback_locale: true,
    ) {
      id
      totalNoOfQuestions
      totalCompletedQuestions
      status
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
          isUserAllowedToTakeAssessment(vibAssessmentAttemptId: $vibAssessmentAttemptId, vibCourseId: $vibCourseId)
          assessmentAssessmentExams {
            id
            assessmentExam {
              id
              title
              status(vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId)
              isValid
            }
          }
          assessmentCurrentExam(vibAssessmentAttemptId: $vibAssessmentAttemptId, vibCourseId: $vibCourseId) {
            id
            title
            status(vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId)
            percentageOfQuestionCompleted(vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId)
          }
        }
      }
    }
  }
`;

const GET_EXAM_QUESTION_ANSWERS = gql`
  query VibGetExamQuestionAnswers (
    $vibCourseId: ID!,
    $vibExamId: ID!,
    $vibAssessmentAttemptId: ID!,
    $locale: String!,
  ) {
    courseAssessmentAttempt(
      vibCourseId: $vibCourseId,
      vibAssessmentAttemptId: $vibAssessmentAttemptId,
      locale: $locale,
      fallback_locale: true,
    ) {
      id
      assessmentType
      courseAssessment {
        id
        assessment {
          id
          assessmentCurrentExam(vibAssessmentAttemptId: $vibAssessmentAttemptId, vibCourseId: $vibCourseId) {
            id
            title
            status(vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId)
            assessmentExamCurrentQuestion(vibExamId: $vibExamId, vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId) {
              id
              question
              submittedAnswer(vibExamId: $vibExamId, vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId) {
                id
                text
                weight
              }
              answers {
                id
                title
                weight
              }
            }
            assessmentExamQuestions {
              id
              assessmentQuestion {
                id
                question
                isValid
                submittedAnswer(vibExamId: $vibExamId, vibCourseId: $vibCourseId, vibAssessmentAttemptId: $vibAssessmentAttemptId, locale: $locale,
                  fallback_locale: true) {
                  id
                  text
                  weight
                }
                answers {
                  id
                  title
                  weight
                }
              }
            }
          }
        }
      }
    }
  }
`;


export {
  GET_COURSE_USER_ASSESSMENT_EXAM_PROGRESS,
  GET_EXAM_QUESTION_ANSWERS
};
