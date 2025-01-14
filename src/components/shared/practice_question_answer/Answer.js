import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Feedback from './Feedback';
import styles from './style.module.scss';
import VibCheckboxRadioButton from '../vib_checkbox_and_radio_button';

const Answer = ({
  answer: {
    id: answerId, answer: answerText, explanation, isCorrectResponse,
  },
  handleOnChange: toggleCheckbox,
  isMultiSelect: enableMultiSelect,
  selectedAnswerIds,
  showLessonLink,
  showFeedback,
  showlockedLessonOrGetLessonLink,
}) => {
  const answerContainerClasses = (
    'answer-container media mb-2',
    styles['feedback-container-bg-color']
  );

  const isChecked = selectedAnswerIds.includes(answerId);

  const getAnswerContainerClass = () => {
    if (showFeedback) {
      if (isChecked && isCorrectResponse) {
        return 'feedback-container-green-bg-color';
      } if (isChecked && !isCorrectResponse) {
        return 'feedback-container-red-bg-color';
      }
    }
  };

  return (
    <>
      <div data-testid={`checkbox-container-${answerId}`} className={classNames(answerContainerClasses, styles[getAnswerContainerClass()])}>
        <VibCheckboxRadioButton
          value={answerId}
          optionId={answerId}
          toggleCheckbox={toggleCheckbox}
          isChecked={isChecked}
          questionId={answerId}
          disableAnswerOptions={showFeedback}
          isMultiSelect={enableMultiSelect}
          showIncorrectOption={(showFeedback && isChecked) && !isCorrectResponse}
          showCorrectOption={(showFeedback && isChecked) && isCorrectResponse}
          label={answerText}
          labelClasses={styles['text-label']}
        />
      </div>

      {
        !enableMultiSelect && showFeedback && isChecked
          ? (
            <Feedback
              feedback={explanation}
              showLessonLink={showLessonLink}
              isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer={isCorrectResponse}
              isChecked={isChecked}
              showlockedLessonOrGetLessonLink={showlockedLessonOrGetLessonLink}
            />
          )
          : null
      }

    </>
  );
};


Answer.defaultProps = {
  isMultiSelect: false,
  selectedAnswerIds: [],
};

Answer.propTypes = {
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    isCorrectResponse: PropTypes.bool.isRequired,
  }).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  showlockedLessonOrGetLessonLink: PropTypes.func.isRequired,
  isMultiSelect: PropTypes.bool,
  selectedAnswerIds: PropTypes.arrayOf(String),
  showLessonLink: PropTypes.bool.isRequired,
  showFeedback: PropTypes.bool.isRequired,
};

export default Answer;
