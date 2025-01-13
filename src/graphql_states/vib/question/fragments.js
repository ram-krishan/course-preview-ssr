import gql from 'graphql-tag';

const examUserProgressDetailsFragment = gql`
  fragment ExamUserProgressDetails on LevelTwoCollectionExamUserProgress {
    id
    status
    submittedAnswers {
      id
      isCorrect
      answerIds
      questionId
    }
    levelTwoCollectionProgress{
      id
      contentType
    }
  }
`;

export {
  examUserProgressDetailsFragment,
};
