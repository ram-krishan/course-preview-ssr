import gql from 'graphql-tag';

const SUBMIT_PAGE_SURVEY_QUESTION_ANSWER = gql`
mutation submitPageSurveyQuestionAnswer (
  $levelOneCollectionProgressId: ID!
  $surveyAnswerId: ID!
  $pageProgressId: ID!
  $surveyQuestionId: ID!
  $courseId: ID!
) {
  submitPageSurveyQuestionAnswer(
    input: {
      levelOneCollectionProgressId: $levelOneCollectionProgressId,
      surveyAnswerId: $surveyAnswerId,
      pageProgressId: $pageProgressId,
      surveyQuestionId: $surveyQuestionId,
      courseId: $courseId,
    }
  ) {
    errorMessages
    success
    nextPageProgressId
    shouldRedirectToNextLevelOneCollection
    nextLevelTwoLevelOneCollectionId
    nextLevelTwoCollectionProgressId
    nextLearnPath
    examUrl
  }
}
`;

const SUBMIT_PAGE_QUESTION_ANSWER = gql`
mutation submitPageQuestionAnswer (
  $answerIds: [ID!]!
  $pageProgressId: ID!
  $questionId: ID!
) {
  submitPageQuestionAnswer(
    input: {
      answerIds: $answerIds,
      pageProgressId: $pageProgressId,
      questionId: $questionId,
    }
  ) {
    errorMessages
    success
  }
}
`;

const COMPLETE_PAGE = gql`
mutation CompletePage (
  $levelOneCollectionProgressId: ID!
  $pageProgressId: ID!
  $courseId: ID!
  $questionId: ID
) {
  completePage(
    input: {
      levelOneCollectionProgressId: $levelOneCollectionProgressId,
      pageProgressId: $pageProgressId,
      courseId: $courseId,
      questionId: $questionId
    }
  ) {
    errorMessages
    success
    nextPageProgressId
    shouldRedirectToNextLevelOneCollection
    nextLevelTwoLevelOneCollectionId
    nextLevelTwoCollectionProgressId
    isAllCoreContentCompletedAndNoEnrichmentStart
    nextLearnPath
    examUrl
    course {
      id
      userActivityPoints
      completedPercentage
    }
  }
}
`;

export {
  COMPLETE_PAGE,
  SUBMIT_PAGE_QUESTION_ANSWER,
  SUBMIT_PAGE_SURVEY_QUESTION_ANSWER,
};
