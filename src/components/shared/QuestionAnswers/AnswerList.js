import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, map, max } from 'lodash';

import Answer from './Answer';

const AnswerList = ({
  answers,
  toggleCheckbox,
  questionId,
  userAnswers,
  answersStyle,
  selectedAnswers,
  showFeedback,
  isMultiSelect,
  disableAnswerOptions,
  isCoursePreview,
}) => {
  const shouldAnswerSelected = (answer) => {
    if (!isEmpty(selectedAnswers)) {
      return map(selectedAnswers, 'id').includes(answer.id);
    } if (!isMultiSelect && !isEmpty(userAnswers)) {
      return map(userAnswers, 'id').includes(answer.id);
    }
    return false;
  };

  const maxWeight = max(map(answers, 'weight'));

  return (
    answers.map((answer) => (
      <Answer
        key={answer.id}
        maxWeight={maxWeight}
        answer={answer}
        optionId={answer.id}
        isChecked={shouldAnswerSelected(answer)}
        toggleCheckbox={toggleCheckbox}
        userAnswers={userAnswers}
        showFeedback={showFeedback && !isEmpty(userAnswers)}
        questionId={questionId}
        answersStyle={answersStyle}
        isMultiSelect={isMultiSelect}
        disableAnswerOptions={disableAnswerOptions}
        isCoursePreview={isCoursePreview}
      />
    ))
  );
};

AnswerList.defaultProps = {
  isMultiSelect: false,
  userAnswers: [],
  answers: [],
};

AnswerList.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
    weight: PropTypes.number.isRequired,
  })),
  toggleCheckbox: PropTypes.func.isRequired,
  userAnswers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      weight: PropTypes.number,
    }),
  ),
  questionId: PropTypes.string.isRequired,
  showFeedback: PropTypes.bool.isRequired,
  answersStyle: PropTypes.string,
  isMultiSelect: PropTypes.bool.isRequired,
  disableAnswerOptions: PropTypes.bool.isRequired,
};
export default AnswerList;
