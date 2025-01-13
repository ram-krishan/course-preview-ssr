import gql from 'graphql-tag';

const CREATE_SENTIMENT_SURVEY_ANSWER = gql`
  mutation createSentimentSurveyAnswer(
    $vibSurveyAnswerId: ID!
    $vibSurveyQuestionId: ID!
    $vibSentimentSurveyProgressId: ID!
  ) {
    createSentimentSurveyAnswer(
      input: {
        vibSurveyAnswerId: $vibSurveyAnswerId
        vibSurveyQuestionId: $vibSurveyQuestionId
        vibSentimentSurveyProgressId: $vibSentimentSurveyProgressId
      }
    ) {
      success
      errorMessages
      nextActivityPath
      course {
        id
        userActivityPoints
        completedPercentage
      }
    }
  }
`;

export {
  CREATE_SENTIMENT_SURVEY_ANSWER,
};
