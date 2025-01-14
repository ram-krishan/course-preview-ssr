import React from 'react';
import PropTypes from 'prop-types';
import Progress from './ProgressBar';
import QuestionAnswer from './QuestionAnswer';

const QuestionAnswerBlock = ({
  levelTwoCollection,
  examProgress,
  currentExamQuestion,
  setCurrentExamQuestion,
  isExamCompleted,
}) => (
  <>
    <Progress
      isBeginExamPage={false}
      totalQuestionsCount={levelTwoCollection.exam.totalQuestions}
      currentExamQuestion={currentExamQuestion}
    />

    <QuestionAnswer
      exam={levelTwoCollection.exam}
      examProgress={examProgress}
      currentExamQuestion={currentExamQuestion}
      setCurrentExamQuestion={setCurrentExamQuestion}
      isExamCompleted={isExamCompleted}
    />
  </>
);

QuestionAnswerBlock.propTypes = {
  isExamCompleted: PropTypes.bool.isRequired,
  levelTwoCollection: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
    }).isRequired,
  }).isRequired,
  examProgress: PropTypes.shape({
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
  }).isRequired,
  currentExamQuestion: PropTypes.shape({
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
  }).isRequired,
  setCurrentExamQuestion: PropTypes.func.isRequired,
};

export default QuestionAnswerBlock;
