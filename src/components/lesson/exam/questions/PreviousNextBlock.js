import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styles from './question.module.scss';
import Loading from '../../../shared/loading';
import VibButton from '../../../shared/vib_button';

const PreviousNextBlock = ({
  handleClickOnNextQuestion,
  handleClickOnPreviousQuestion,
  displayBackToPreviousQuestionLink,
  disableContinueButton,
  isLoadingNextQuestion,
  isLoadingPrevQuestion,
}) => (
  <div className="d-flex justify-content-between align-items-center my-4">
    <div
      className={classNames(
        styles['previous-btn'], styles['f-12'], 'ml-3', styles[isLoadingPrevQuestion ? 'pointer-none' : ''],
      )}
    >
      {
        displayBackToPreviousQuestionLink ? (
          <div onClick={handleClickOnPreviousQuestion}>
            {isLoadingPrevQuestion ? <Loading /> : null}
            <strong><FormattedMessage id="course.exam.heading.backToPreviousQuestion" /></strong>
          </div>
        ) : null
      }
    </div>

    <div className="d-flex align-items-center">
      <div className="ml-3">
        <VibButton
          variant="secondary"
          handleSubmit={handleClickOnNextQuestion}
          isDisabled={disableContinueButton}
          isLoading={isLoadingNextQuestion}
        >
          <FormattedMessage id="button.next" />
        </VibButton>
      </div>
    </div>
  </div>
);

PreviousNextBlock.propTypes = {
  handleClickOnNextQuestion: PropTypes.func.isRequired,
  handleClickOnPreviousQuestion: PropTypes.func.isRequired,
  displayBackToPreviousQuestionLink: PropTypes.bool.isRequired,
  disableContinueButton: PropTypes.bool.isRequired,
  isLoadingNextQuestion: PropTypes.bool.isRequired,
  isLoadingPrevQuestion: PropTypes.bool.isRequired,
};

export default PreviousNextBlock;
