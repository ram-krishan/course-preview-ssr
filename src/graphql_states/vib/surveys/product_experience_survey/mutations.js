import gql from 'graphql-tag';

const UPDATE_PRODUCT_EXPERIENCE_SURVEY_PROGRESS = gql`
  mutation updateProductExperienceSurveyProgress (
    $productExperienceSurveyProgressId: ID!
    $status: ProductExperienceSurveyEnum!
  ) {
    updateProductExperienceSurveyProgress(
      input: {
        status: $status,
        productExperienceSurveyProgressId: $productExperienceSurveyProgressId,
      }
    ) {
      errorMessages
      success
      surveyProgress {
        id
        status
        remindMeAt
      }
    }
  }
`;


const CREATE_PRODUCT_EXPERIENCE_SURVEY_QUESTION_ANSWER = gql`
  mutation createProductExperienceSurveyQuestionAnswer (
    $productExperienceSurveyAttributes: [ProductExperienceSurveysAttributes!]!
  ) {
    createProductExperienceSurveyQuestionAnswer(
      input: {
        productExperienceSurveyAttributes: $productExperienceSurveyAttributes,
      }
    ) {
      errorMessages
      success
      surveyProgress {
        id
        status
        remindMeAt
      }
      productExperienceSurveyActionPlan {
        id
        key
        status
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
  UPDATE_PRODUCT_EXPERIENCE_SURVEY_PROGRESS,
  CREATE_PRODUCT_EXPERIENCE_SURVEY_QUESTION_ANSWER,
};
