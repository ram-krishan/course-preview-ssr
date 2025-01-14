import React from 'react';
import { compact } from 'lodash';
import PropTypes from 'prop-types';
import AnswerList from './AnswerList';

const PracticeQuestionAnswers = ({
  handleOnChange,
  userAnswers,
  selectedAnswers,
  showFeedback,
  showLessonLink,
  question,
  showlockedLessonOrGetLessonLink,
}) => {
  const { answers, isMultipleChoiceQuestion } = question;
  return (
    <>
      <AnswerList
        answers={answers}
        userAnswers={compact(userAnswers)}
        selectedAnswers={compact(selectedAnswers)}
        handleOnChange={(event) => handleOnChange(event)}
        showFeedback={showFeedback}
        isMultiSelect={isMultipleChoiceQuestion}
        showLessonLink={showLessonLink}
        showlockedLessonOrGetLessonLink={showlockedLessonOrGetLessonLink}
      />
    </>
  );
};

PracticeQuestionAnswers.defaultProps = {
  userAnswers: [],
  showFeedback: false,
  selectedAnswers: [],
};

PracticeQuestionAnswers.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  showlockedLessonOrGetLessonLink: PropTypes.func.isRequired,
  userAnswers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      weight: PropTypes.number,
    }),
  ),
  selectedAnswers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  showFeedback: PropTypes.bool,
  showLessonLink: PropTypes.bool.isRequired,
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isMultipleChoiceQuestion: PropTypes.bool.isRequired,
    isTextOrVedioPresent: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    question: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      feedback: PropTypes.string,
      isCorrectResponse: PropTypes.bool.isRequired,
    })).isRequired,
    text: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
    video: PropTypes.shape({
      contentType: PropTypes.string,
      fileUrl: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
};

export default PracticeQuestionAnswers;
