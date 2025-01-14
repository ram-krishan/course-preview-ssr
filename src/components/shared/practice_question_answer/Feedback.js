// Un-used component
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styles from './style.module.scss';

const Feedback = ({
  feedback,
  isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer,
  showLessonLink,
  showlockedLessonOrGetLessonLink,
}) => {
  const getFeedbackLabel = () => (isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer
    ? (<FormattedMessage id="answers.feedback.label.correct" />)
    : (<FormattedMessage id="answers.feedback.label.incorrect" />));

  const getFeedbackLabelClass = () => (isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer ? 'correct-feedback-label' : 'incorrect-feedback-label');

  return (
    <div className={classNames(styles['feedback-container'], 'mb-3 mt-2')}>
      <span className={classNames(styles[getFeedbackLabelClass()])}>
        {' '}
        { getFeedbackLabel() }
        {' '}
      </span>
      <span className={styles['feedback-text']}>
        <div dangerouslySetInnerHTML={{ __html: feedback }} />
      </span>
      {
        showLessonLink ? showlockedLessonOrGetLessonLink() : null
      }
    </div>
  );
};


Feedback.propTypes = {
  feedback: PropTypes.string.isRequired,
  isCorrectAnswerSelectedOrShowFeedbackOnCorrectAnswer: PropTypes.bool.isRequired,
  showLessonLink: PropTypes.bool.isRequired,
  showlockedLessonOrGetLessonLink: PropTypes.func.isRequired,
};
export default Feedback;
