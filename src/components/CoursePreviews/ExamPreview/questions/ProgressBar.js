import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as Bootstrap from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import styles from './question.module.scss';
import './style.scss';

const percentage = (number, total) => {
  if (total === 0) { return 0; }
  return Math.round((number / parseFloat(total)) * 100);
};

const ProgressBar = ({
  isBeginExamPage,
  totalQuestionsCount,
  position,
}) => (
  <div>
    <div className={classNames(styles['questions-complete-text'], 'mb-1')}>
      <FormattedMessage
        id="course.exam.progressBar.questionCompleteMessage"
        values={{
          currentQuestionPosition: position,
          totalQuestionsCount,
        }}
      />
    </div>

    <Bootstrap.ProgressBar
      className={styles['progress-bar']}
      now={percentage(position, totalQuestionsCount)}
    />

    {isBeginExamPage ? (
      <div data-testid="description" className={classNames(styles['exam-progress-bar-hint'], 'd-flex mt-1')}>
        <FormattedMessage id="course.exam.progressBar.examTimeDescription" />
      </div>
    ) : null}
  </div>
);

ProgressBar.propTypes = {
  isBeginExamPage: PropTypes.bool.isRequired,
  totalQuestionsCount: PropTypes.number.isRequired,
  currentExamQuestion: PropTypes.shape({
    position: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProgressBar;
