import React from 'react';
import { compact } from 'lodash';
import PropTypes from 'prop-types';
import Question from './Question';
import AnswerList from './AnswerList';

const QuestionAnswers = ({
  questionData,
  handleSelectAnswer,
  userAnswers,
  answersStyle,
  questionsStyle,
  selectedAnswers,
  showFeedback,
  disableAnswerOptions,
  isCoursePreview,
}) => (
  <>
    <Question questionText={questionData.question} questionsStyle={questionsStyle} />
    <AnswerList
      answersStyle={answersStyle}
      answers={questionData.answers}
      userAnswers={compact(userAnswers)}
      selectedAnswers={compact(selectedAnswers)}
      toggleCheckbox={(event) => handleSelectAnswer(event)}
      questionId={questionData.id}
      showFeedback={showFeedback}
      isMultiSelect={questionData.isMultipleChoiceQuestion}
      disableAnswerOptions={disableAnswerOptions}
      isCoursePreview={isCoursePreview}
    />
  </>
);

QuestionAnswers.defaultProps = {
  userAnswers: [],
  showFeedback: false,
  disableAnswerOptions: false,
};

QuestionAnswers.propTypes = {
  questionData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string,
        weight: PropTypes.number.isRequired,
      }),
    ),
  }).isRequired,
  handleSelectAnswer: PropTypes.func.isRequired,
  questionsStyle: PropTypes.string,
  userAnswers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      weight: PropTypes.number,
    }),
  ),
  showFeedback: PropTypes.bool,
  answersStyle: PropTypes.string,
  questionsStyle: PropTypes.string,
  disableAnswerOptions: PropTypes.bool,
};

export default QuestionAnswers;
