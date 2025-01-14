import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import VibCheckboxRadioButton from '../vib_checkbox_and_radio_button';
import classNames from 'classnames';
import styles from './style.module.scss';

const Answer = ({
  maxWeight,
  answer,
  isChecked,
  optionId,
  toggleCheckbox,
  showFeedback,
  questionId,
  userAnswers,
  answersStyle,
  hideCheckBox,
  isMultiSelect,
  disableAnswerOptions,
  isCoursePreview
}) => {
  const isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer = () => {
    return (showFeedback && !isChecked && answer.weight === maxWeight)
      || (isChecked && !isEmpty(userAnswers) && userAnswers[0].weight === maxWeight)
  };

  const showOnlyForSelectedOrCorrectAnswer = () => (
    showFeedback && (isChecked || (isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer()))
  );

  const getFeedbackLabel = () => (
    isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer()
      ? <FormattedMessage id="answers.feedback.label.correct" />
      : <FormattedMessage id="answers.feedback.label.incorrect" />
  );

  const getFeedbackLabelClass = () => (
    isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer()
      ? 'correct-feedback-label'
      : 'incorrect-feedback-label'
  );

  const isIncorrectAnswerSelected = () => {
    return (
      showFeedback &&
      isChecked &&
      !isEmpty(userAnswers) &&
      userAnswers[0].weight !== maxWeight
    );
  };

  const getAnswerContainerClass = () => {
    let answerContainerClassName = '';
    if (showFeedback && isIncorrectAnswerSelected()) {
      answerContainerClassName = 'feedback-container-red-bg-color';
    } else if (showFeedback && isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer()) {
      answerContainerClassName = 'feedback-container-green-bg-color';
    }
    return answerContainerClassName;
  };

  const getContainerClassForSelectedAnswerOnly = () => {
    if (showFeedback) {
      if (isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer()) {
        return 'correct-answer-selected-container';
      }
      return 'incorrect-answer-selected-container';
    }
  };

  const getAnswerContainerBorderClass = () => {
    let answerContainerClassName = '';
    if (isIncorrectAnswerSelected()) {
      answerContainerClassName = 'incorrect-answer-border';
    } else if (showFeedback && isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer()) {
      answerContainerClassName = 'correct-answer-border';
    }
    return answerContainerClassName;
  };
  const getCheckedCheckboxClassName = () => {
    if (isChecked) {
      return 'checked-checkbox-container';
    }
    return '';
  };

  const getAnswerTitle = () => {
    if (isCoursePreview === true) {
      return `${answer.weight} - ${answer.title}`;
    }
    return answer.title;
  };

  return (
    <>
      <div
        className={classNames(styles['feedback-container-bg-color'], styles[getAnswerContainerClass()],
          styles[getAnswerContainerBorderClass()],
          styles[getContainerClassForSelectedAnswerOnly()],
          styles[getCheckedCheckboxClassName()],
          answersStyle,
          'answer-container media mb-2')}
      >
        {
          !hideCheckBox
            ? (
              <>
                <VibCheckboxRadioButton
                  value={optionId}
                  optionId={optionId}
                  toggleCheckbox={toggleCheckbox}
                  isChecked={isChecked}
                  questionId={questionId}
                  disableAnswerOptions={disableAnswerOptions}
                  isMultiSelect={isMultiSelect}
                />
              </>
            )
            : null
        }
        <div className={classNames(styles.options, 'media-body text-dark')}>
          <label htmlFor={`answer-checkbox-${optionId}`}>
            { getAnswerTitle() }
          </label>
        </div>
      </div>

      {
        (showOnlyForSelectedOrCorrectAnswer())
          ? (
            <div className={classNames(styles['feedback-container'], 'mb-3')}>
              <span data-testid="feedback-label" className={classNames(styles[getFeedbackLabelClass()])}>
                {' '}
                { getFeedbackLabel() }
                {' '}
              </span>
              <span data-testid="feedback-text">
                { answer.feedback }
                {' '}
              </span>
            </div>
          )
          : null
      }

    </>
  );
};

Answer.defaultProps = {
  maxWeight: 4,
  userAnswers: [],
  hideCheckBox: false,
  isMultiSelect: false,
  questionId: '',
  answersStyle: '',
  isChecked: false,
  toggleCheckbox: null,
  disableAnswerOptions: false,
};

Answer.propTypes = {
  maxWeight: PropTypes.number,
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    weight: PropTypes.number,
    feedback: PropTypes.string,
  }).isRequired,
  isChecked: PropTypes.bool,
  optionId: PropTypes.string.isRequired,
  toggleCheckbox: PropTypes.func,
  showFeedback: PropTypes.bool.isRequired,
  questionId: PropTypes.string,
  answersStyle: PropTypes.string,
  userAnswers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      weight: PropTypes.number,
    }),
  ),
  hideCheckBox: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  disableAnswerOptions: PropTypes.bool,
};
export default Answer;
