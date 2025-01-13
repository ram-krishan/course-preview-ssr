import gql from 'graphql-tag';

const GET_COURSE_SENTIMENT_SURVEY_PROGRESS = gql`
  query courseSentimentSurveyProgress($vibCourseId: ID!, $vibSentimentSurveyProgressId: ID!) {
    courseSentimentSurveyProgress(vibCourseId: $vibCourseId, vibSentimentSurveyProgressId: $vibSentimentSurveyProgressId) {
      id
      surveyType
      status
      isUserAllowedToTakeSentimentSurvey
      course {
        id
        title
        status
      }
      sentimentSurvey {
        id
        title
        surveyQuestions {
          id
          question
          description
          surveyAnswers {
            id
            choiceText
          }
        }
      }
      currentSurveyQuestion {
        id
      }
    }
  }
`;

export {
  GET_COURSE_SENTIMENT_SURVEY_PROGRESS,
};
