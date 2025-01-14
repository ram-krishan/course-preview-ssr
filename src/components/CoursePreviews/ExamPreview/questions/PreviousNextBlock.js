import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './question.module.scss';
import VibButton from '../../../shared/vib_button';

const PreviousNextBlock = ({
  handleClickOnNextQuestion,
  handleClickOnPreviousQuestion,
  displayBackToPreviousQuestionLink,
  nextDisable,
}) => (
  <div className="d-flex justify-content-between align-items-center my-4">
    <div
      className={classNames(
        styles['previous-btn'], styles['f-12'], 'ml-3',
      )}
    >
      {
        displayBackToPreviousQuestionLink ? (
          <div onClick={handleClickOnPreviousQuestion}>
            <strong>
              <h1 id="course.exam.heading.backToPreviousQuestion" />
            </strong>
          </div>
        ) : null
      }
    </div>

    <div className="d-flex align-items-center">
      <div className="ml-3">
        <VibButton
          variant="secondary"
          handleSubmit={handleClickOnNextQuestion}
          isDisabled={nextDisable}
        >
          <h1 id="button.next" />
        </VibButton>
      </div>
    </div>
  </div>
);

PreviousNextBlock.propTypes = {
  handleClickOnNextQuestion: PropTypes.func.isRequired,
  handleClickOnPreviousQuestion: PropTypes.func.isRequired,
  displayBackToPreviousQuestionLink: PropTypes.bool.isRequired,
  nextDisable: PropTypes.bool.isRequired,
};

export default PreviousNextBlock;
