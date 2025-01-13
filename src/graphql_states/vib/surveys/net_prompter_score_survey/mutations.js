import gql from 'graphql-tag';

const CREATE_COURSE_NET_PROMOTER_SCORE_SURVEY_ANSWER = gql`
  mutation createCourseNetPromoterScoreSurveyAnswer (
    $vibCourseId: ID!
    $vibSurveyQuestionId: ID!
    $vibSurveyAnswerId: ID!
  ) {
    createCourseNetPromoterScoreSurveyAnswer (
      input: {
        vibCourseId: $vibCourseId,
        vibSurveyAnswerId: $vibSurveyAnswerId,
        vibSurveyQuestionId: $vibSurveyQuestionId,
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

export {
  CREATE_COURSE_NET_PROMOTER_SCORE_SURVEY_ANSWER,
};
