import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  map,
  minBy,
  filter,
  isEmpty,
} from 'lodash';

import Progress from './ProgressBar';
import BeginScreen from '../BeginScreen';
import QuestionAnswerBlock from './QuestionAnswerBlock';
import useSuperScript from '../../../shared/hooks/useSuperScript';

const QuestionBody = ({
  levelTwoCollection,
  levelTwoCollectionExamUserProgress: examProgress,
  lastLessonPath,
  isExamProgressCompleted,
  isExamRevisiting,
  canShowLastQuestion,
}) => {
  useSuperScript();

  const { exam: { totalQuestions } } = levelTwoCollection;
  const getCurrentExamQuestion = () => {
    const { examQuestions } = levelTwoCollection.exam;
    if (isEmpty(examProgress)) { return examQuestions[0]; }
    if (isExamProgressCompleted) {
      if (canShowLastQuestion) {
        return examQuestions[examQuestions.length - 1];
      }
      return examQuestions[0];
    }
    const submittedQuestionIds = map(examProgress.submittedAnswers, 'questionId');
    const remainingExamQuestions = filter(
      examQuestions,
      (examQuestion) => !submittedQuestionIds.includes(examQuestion.question.id),
    );
    return minBy(remainingExamQuestions, 'position');
  };

  const [currentExamQuestion, setCurrentExamQuestion] = useState(
    getCurrentExamQuestion,
  );

  const isExamInProgress = () => (
    !isEmpty(examProgress) && examProgress.status === 'inProgress'
  );

  const [examAttempted, setExamAttempted] = useState(isExamInProgress);

  const isExamCompleted = () => (
    !isEmpty(examProgress) && examProgress.status === 'completed'
  );

  const shouldVisibleQuestionAnswerBlock = () => (
    (examAttempted && !isExamCompleted())
    || (isExamProgressCompleted && isExamRevisiting)
  );

  const lastLevelOneCollection = levelTwoCollection.levelTwoLevelOneCollections[levelTwoCollection.levelTwoLevelOneCollections.length - 1].levelOneCollection;

  return (
    <div data-testid="question-body">
      {shouldVisibleQuestionAnswerBlock() ? (
        <QuestionAnswerBlock
          levelTwoCollection={levelTwoCollection}
          examProgress={examProgress}
          currentExamQuestion={currentExamQuestion}
          isExamCompleted={isExamCompleted()}
          setCurrentExamQuestion={setCurrentExamQuestion}
        />
      ) : (
        <>
          <Progress
            isBeginExamPage
            totalQuestionsCount={totalQuestions}
            currentExamQuestion={currentExamQuestion}
          />

          <BeginScreen
            lastLessonPath={lastLessonPath}
            setExamAttempted={setExamAttempted}
            totalQuestion={totalQuestions}
            isExamCompleted={isExamCompleted()}
            levelTwoCollectionExamUserProgressId={examProgress.id}
            lastLevelOneCollection={lastLevelOneCollection}
          />
        </>
      )}
    </div>
  );
};

QuestionBody.defaultProps = {
  levelTwoCollectionExamUserProgress: null,
};

QuestionBody.propTypes = {
  canShowLastQuestion: PropTypes.bool.isRequired,
  isExamRevisiting: PropTypes.bool.isRequired,
  isExamProgressCompleted: PropTypes.bool.isRequired,
  levelTwoCollection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    levelTwoLevelOneCollections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        position: PropTypes.number.isRequired,
        levelOneCollection: PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    ).isRequired,
    exam: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      image: PropTypes.shape({
        id: PropTypes.string,
        url: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
      totalQuestions: PropTypes.number.isRequired,
      examQuestions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          position: PropTypes.number.isRequired,
          question: PropTypes.shape({
            id: PropTypes.string.isRequired,
            question: PropTypes.string.isRequired,
            questionType: PropTypes.string.isRequired,
            answers: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired,
                answer: PropTypes.string.isRequired,
              }),
            ),
          }).isRequired,
        }),
      ),
    }),
  }).isRequired,
  levelTwoCollectionExamUserProgress: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    submittedAnswers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        answerIds: PropTypes.arrayOf(
          PropTypes.string.isRequired,
        ).isRequired,
        questionId: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }),
  lastLessonPath: PropTypes.string.isRequired,
};

export default QuestionBody;
