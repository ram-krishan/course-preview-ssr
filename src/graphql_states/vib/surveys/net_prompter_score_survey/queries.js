import gql from 'graphql-tag';

const GET_COURSE_NET_PROMOTER_SCORE_SURVEY = gql`
  query courseNetPromoterScoreSurvey (
    $vibCourseId: ID!
  ) {
    courseNetPromoterScoreSurvey(vibCourseId: $vibCourseId) {
      id
      heading
      lowRatingHintText
      highRatingHintText
      surveyQuestion {
        id
        question
        surveyAnswers {
          id
          choiceText
          value
        }
      }
    }
  }
`;

export {
  GET_COURSE_NET_PROMOTER_SCORE_SURVEY,
};
