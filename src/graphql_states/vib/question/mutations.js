import gql from 'graphql-tag';
import { examUserProgressDetailsFragment } from './fragments';

const UPDATE_EXAM_PROGRESS = gql`
  mutation updateExamProgress(
    $levelTwoCollectionExamUserProgressId: ID!
  ) {
    updateExamProgress(
      input: {
        levelTwoCollectionExamUserProgressId: $levelTwoCollectionExamUserProgressId
      }
    ) {
      errorMessages
      success
      levelTwoCollectionExamUserProgress {
        ...ExamUserProgressDetails
      }
    }
  }
  ${examUserProgressDetailsFragment}
`;

const CREATE_OR_UPDATE_LEVEL_TWO_EXAM_USER_ANSWER = gql`
  mutation createOrUpdateLevelTwoExamUserAnswer(
    $questionId: ID!
    $answerIds: [ID!]!
    $levelTwoCollectionExamUserProgressId: ID!
  ) {
    createOrUpdateLevelTwoExamUserAnswer(
      input: {
        questionId: $questionId,
        answerIds: $answerIds,
        levelTwoCollectionExamUserProgressId: $levelTwoCollectionExamUserProgressId,
      }
    ) {
      errorMessages
      success
      isAllCoreContentCompletedAndNoEnrichmentStart
      levelTwoCollectionExamUserProgress {
        ...ExamUserProgressDetails
      }
      learnPath
      course {
        id
        userActivityPoints
        completedPercentage
      }
    }
  }
  ${examUserProgressDetailsFragment}
`;

export {
  UPDATE_EXAM_PROGRESS,
  CREATE_OR_UPDATE_LEVEL_TWO_EXAM_USER_ANSWER,
};
