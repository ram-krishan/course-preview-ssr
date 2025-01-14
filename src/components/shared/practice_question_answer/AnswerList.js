import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import Answer from './Answer';


const AnswerList = ({
  answers,
  handleOnChange,
  userAnswers,
  selectedAnswers,
  showFeedback,
  isMultiSelect,
  showLessonLink,
  showlockedLessonOrGetLessonLink,
}) => {
  const getAnswerIds = (selectedUserAnswers) => (
    selectedUserAnswers.map((answer) => answer.id)
  );
  const selectedAnswerIds = getAnswerIds(selectedAnswers);

  const allAnswers = () => (
    answers.map((answer) => (
      <Answer
        key={answer.id}
        answer={answer}
        handleOnChange={handleOnChange}
        isMultiSelect={isMultiSelect}
        selectedAnswerIds={selectedAnswerIds}
        showLessonLink={showLessonLink}
        showFeedback={showFeedback && !isEmpty(userAnswers)}
        showlockedLessonOrGetLessonLink={showlockedLessonOrGetLessonLink}
      />
    ))
  );

  return (
    <>
      { allAnswers()}
    </>
  );
};

AnswerList.defaultProps = {
  isMultiSelect: false,
  userAnswers: [],
  answers: [],
  selectedAnswers: [],
};

AnswerList.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    feedback: PropTypes.string,
    isCorrectResponse: PropTypes.bool.isRequired,
  })),
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
    id: PropTypes.string,
    text: PropTypes.string,
    weight: PropTypes.number,
  })),
  isMultiSelect: PropTypes.bool,
  showFeedback: PropTypes.bool.isRequired,
  showLessonLink: PropTypes.bool.isRequired,
};
export default AnswerList;
