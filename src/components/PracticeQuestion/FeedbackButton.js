import React, { useState } from 'react';
import {
  isEmpty,
} from 'lodash';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import styles from './practice-page.module.scss';
import VibButton from '../shared/vib_button';
import { vibGraphqlStates, flashMessageState } from '../../../graphql_states';

const FeedbackButton = ({
  currentPracticeQuestion,
  confidenceOfResponse,
  setUserAnswer,
  selectedAnswers,
  setCoursePracticeSessionId,
  coursePracticeSessionId,
  setLessonsLink,
  takingAllMeasurementCategories,
  setShowLessonsLink,
}) => {
  const { user_course_practice_id: userCoursePracticeId } = useParams();
  const [selectedSurveyAnswer, setSelectedSurveyAnswer] = useState(null);

  const [createPracticeQuestionAnswer, { loading }] = useMutation(
    vibGraphqlStates.practiceQuestion.mutations.CREATE_PRACTICE_QUESTION_ANSWER,
  );

  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  const getAnswerIds = (answers) => (
    answers.map((answer) => answer.id)
  );

  const handleButtonClick = (surveyAnswer) => {
    setSelectedSurveyAnswer(surveyAnswer);
    createPracticeQuestionAnswer({
      variables: {
        userCoursePracticeId,
        practiceQuestionId: currentPracticeQuestion.id,
        vibAnswerIds: getAnswerIds(selectedAnswers),
        confidenceOfResponseAnswerId: surveyAnswer.id,
        coursePracticeSessionId,
        takingAllCategories: takingAllMeasurementCategories,
      },
    }).then((response) => {
      setUserAnswer(selectedAnswers);
      setSelectedSurveyAnswer(null);
      const {
        success,
        errorMessages,
        coursePracticeSession,
        levelOneCollectionLink,
        showLevelOneCollectonLink,
      } = response.data.submitPracticeQuestionAnswer;

      if (success) {
        setLessonsLink(levelOneCollectionLink);
        setShowLessonsLink(showLevelOneCollectonLink);
        setCoursePracticeSessionId(coursePracticeSession.id);
      } else {
        updateFlashMessage({ variables: { message: errorMessages, messageType: 'danger' } });
      }
    });
  };
  return (
    <Row className="pt-3">
      <Col data-testid="feedback-button-container" sm={12} className="d-flex justify-content-center">
        {
          confidenceOfResponse.surveyAnswers.map((surveyAnswer) => (
            <VibButton
              key={surveyAnswer.id}
              handleSubmit={() => handleButtonClick(surveyAnswer)}
              isDisabled={isEmpty(selectedAnswers)}
              variant="secondary"
              isLoading={loading && selectedSurveyAnswer === surveyAnswer}
              classes={styles['feedback-btn']}
            >
              {surveyAnswer.choiceText}
            </VibButton>
          ))
        }
      </Col>
    </Row>
  );
};

FeedbackButton.defaultProps = {
  selectedAnswers: [],
  coursePracticeSessionId: '',
};
FeedbackButton.propTypes = {
  currentPracticeQuestion: PropTypes.shape({
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
        choiceText: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  }).isRequired,
  confidenceOfResponse: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    surveyAnswers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  setUserAnswer: PropTypes.func.isRequired,
  setCoursePracticeSessionId: PropTypes.func.isRequired,
  selectedAnswers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  coursePracticeSessionId: PropTypes.number,
  setLessonsLink: PropTypes.func.isRequired,
  setShowLessonsLink: PropTypes.func.isRequired,
  takingAllMeasurementCategories: PropTypes.bool.isRequired,
};
export default FeedbackButton;
