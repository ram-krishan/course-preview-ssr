import gql from 'graphql-tag';

const PRODUCT_EXPERIENCE_SURVEY_PROGRESS = gql`
  query productExperienceSurveyProgress{
    productExperienceSurveyProgress{
      id
      status
      remindMeAt
      shouldForceUserToTakeSurvey
      isProductExperienceEnabled
      productExperienceSurvey{
        id,
        surveyQuestions{
          id
          title
          surveyAnswers{
            id
            title
            value
          }
        }
      }
    }
  }
`;

export {
  PRODUCT_EXPERIENCE_SURVEY_PROGRESS,
};
