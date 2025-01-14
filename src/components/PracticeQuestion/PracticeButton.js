import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import { useMutation } from '@apollo/react-hooks';
import styles from './practice-page.module.scss';
import VibButton from '../shared/vib_button';
import { vibGraphqlStates, flashMessageState } from '../../../graphql_states';

const PracticeButton = ({
  userAnswer,
  coursePracticeSessionId,
  currentPracticeQuestionIndex,
  setCurrentPracticeQuestion,
  practiceQuestions,
  setSelectedAnswers,
  setUserAnswer,
  switchToNextSetOfPracticeQuestions,
}) => {
  const history = useHistory();

  const [leavePracticeSession, { loading }] = useMutation(
    vibGraphqlStates.userPractice.mutations.LEAVE_PRACTICE_SESSION,
  );

  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  const handleNextBtnSubmit = () => {
    setSelectedAnswers([]);
    setUserAnswer(null);
    const nextPracticeQuestion = practiceQuestions[currentPracticeQuestionIndex + 1];
    if (!nextPracticeQuestion) {
      switchToNextSetOfPracticeQuestions();
    } else {
      setCurrentPracticeQuestion(nextPracticeQuestion);
    }
  };

  const handleEndPracticeBtn = () => {
    if (coursePracticeSessionId) {
      leavePracticeSession({
        variables: {
          coursePracticeSessionId,
        },
      }).then((response) => {
        const {
          success,
          errorMessages,
        } = response.data.leavePracticeSession;
        if (success) {
          history.push(`/practice/${coursePracticeSessionId}/result`);
        } else {
          updateFlashMessage({ variables: { message: errorMessages, messageType: 'danger' } });
        }
      });
    } else {
      history.push('/practice');
    }
  };

  return (
    <Col lg={12} className="p-0">
      <div className="d-flex justify-content-between mt-4 pb-4">
        <VibButton
          variant="secondary-outline"
          classes={styles['leave-practice-btn']}
          handleSubmit={() => handleEndPracticeBtn()}
        >
          <FormattedMessage id="practicePage.button.endPractice" />
        </VibButton>
        <VibButton
          key={`${new Date().getTime()}${Math.random()}`}
          variant="secondary"
          isDisabled={isEmpty(userAnswer)}
          classes={styles['next-btn']}
          handleSubmit={() => handleNextBtnSubmit()}
        >
          <FormattedMessage id="practicePage.button.next" />
        </VibButton>
      </div>
    </Col>
  );
};


PracticeButton.defaultProps = {
  userAnswer: [],
  coursePracticeSessionId: '',
};

PracticeButton.propTypes = {
  userAnswer: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  coursePracticeSessionId: PropTypes.string,
  currentPracticeQuestionIndex: PropTypes.number.isRequired,
  setCurrentPracticeQuestion: PropTypes.func.isRequired,
  practiceQuestions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.shape({
      id: PropTypes.string.isRequired,
      isMultipleChoiceQuestion: PropTypes.bool.isRequired,
      isTextOrVedioPresent: PropTypes.bool.isRequired,
      isValid: PropTypes.bool.isRequired,
      question: PropTypes.string.isRequired,
      text: PropTypes.shape({
        text: PropTypes.string.isRequired,
      }).isRequired,
      video: PropTypes.shape({
        contentType: PropTypes.string,
        fileUrl: PropTypes.string,
        title: PropTypes.string,
      }),
    }).isRequired,
    confidenceOfResponse: PropTypes.shape({
      id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      surveyAnswers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  })).isRequired,
  setSelectedAnswers: PropTypes.func.isRequired,
  setUserAnswer: PropTypes.func.isRequired,
  switchToNextSetOfPracticeQuestions: PropTypes.func.isRequired,
};
export default PracticeButton;
