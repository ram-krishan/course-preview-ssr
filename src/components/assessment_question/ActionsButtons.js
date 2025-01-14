import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import { useMutation } from '@apollo/react-hooks';

import { useHistory } from 'react-router-dom';

import { vibGraphqlStates, flashMessageState } from '../../../graphql_states';
import styles from './assessment-question.module.scss';
import { getCurrentExamQuestionId, isAnswerChanged } from './utils';
import VibButton from '../shared/vib_button';
import VibRouteGenerator from '../shared/vib_route_generator';

const ActionsButtons = ({
  courseAssessmentAttempt,
  selectedAnswer,
  courseId,
  vibAssessmentAttemptId,
  assessmentExamQuestionsState,
  assessmentExamDispatcher,
  setSelectedAnswers,
  setPromptMessage,
}) => {
  const history = useHistory();
  const { assessmentExamQuestions, currentQuestion, assessmentId } = assessmentExamQuestionsState;

  const [saveAssessmentQuestionAnswer, { loading }] = useMutation(
    vibGraphqlStates.assessment.exam.mutations.CREATE_ASSESSMENT_EXAM_USER_ANSWER,
  );
  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  const handleBackToPreviousQuestionClick = () => {
    setSelectedAnswers([]);
    assessmentExamDispatcher({ type: 'ON_BACK_TO_PREVIOUS_BUTTON_CLICK' });
  };

  const handleContinueButtonClick = () => {
    if (isAnswerChanged(currentQuestion, selectedAnswer)) {
      updateOrCreateQuestionAnswer();
    } else {
      assessmentExamDispatcher({ type: 'ON_CONTINUE_BUTTON_CLICK', payload: { isAnswerChanged: false } });
    }
  };

  const updateOrCreateQuestionAnswer = () => {
    const examQuestionId = getCurrentExamQuestionId(assessmentExamQuestions, currentQuestion);
    saveAssessmentQuestionAnswer({
      variables: {
        vibCourseId: courseId,
        vibAnswerId: selectedAnswer.id,
        vibExamQuestionId: examQuestionId,
        vibAssessmentAttemptId,
        assessmentAttemptType: courseAssessmentAttempt.assessmentType,
      },
    }).then((response) => {
      const {
        success, errorMessages, courseAssessmentAttempt, showStatusPage,
      } = response.data.createAssessmentExamUserAnswer;
      if (!success) {
        updateFlashMessage({ variables: { message: errorMessages, messageType: 'danger' } });
      } else if (showStatusPage) {
        // redirect to assessment status page
        setPromptMessage('');
        history.push(VibRouteGenerator.getAssessmentStatusPageUrl(courseId, courseAssessmentAttempt.id));
      } else if (assessmentExamQuestionsState.nextQuestion === null) {
        // all question completed and redirect to assessment landing page
        setPromptMessage('');
        history.push(VibRouteGenerator.getAssessmentPageUrl(courseId, courseAssessmentAttempt.assessmentType));
      } else {
        assessmentExamDispatcher({
          type: 'ON_CONTINUE_BUTTON_CLICK',
          payload: {
            isAnswerChanged: true,
            updatedAnswer: selectedAnswer,
          },
        });
        setSelectedAnswers([]);
      }
    });
  };


  return (
    <div className="d-flex justify-content-end align-items-center pt-3">
      <div>
        <Button
          data-testid="go-back-btn"
          className={classnames(styles['goBack-btn'])}
          onClick={handleBackToPreviousQuestionClick}
        >
          {
          assessmentExamQuestionsState.previousQuestion
            ? <h1 id="button.back_to_previous" />
            : null
        }
        </Button>
      </div>
      <div>
        <VibButton
          handleSubmit={handleContinueButtonClick}
          isDisabled={selectedAnswer === null}
          isLoading={loading}
          variant="secondary"
          classes={classnames(styles['goContinue-btn'])}
        >
          <h1 id="button.continue" />
        </VibButton>
      </div>
    </div>
  );
};

ActionsButtons.propTypes = {
  selectedAnswer: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  courseId: PropTypes.string.isRequired,
  assessmentExamQuestionsState: PropTypes.instanceOf(Object).isRequired,
  assessmentExamDispatcher: PropTypes.func.isRequired,
  setPromptMessage: PropTypes.func.isRequired,
  setSelectedAnswers: PropTypes.func.isRequired,
  vibAssessmentAttemptId: PropTypes.string.isRequired,
};

export default ActionsButtons;
