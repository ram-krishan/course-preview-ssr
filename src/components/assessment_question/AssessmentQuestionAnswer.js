import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, find } from 'lodash';
import { Redirect, Prompt } from 'react-router-dom';
import {
  useIntl,
  intlShape,
} from 'react-intl';

import styles from './assessment-question.module.scss';
import QuestionAnswers from '../shared/QuestionAnswers';
import ActionsButtons from './ActionsButtons';
import { examQuestionAnswerInitialState, assessmentExamReducer } from './reducer';
import usePreventReload from '../shared/hooks/UsePreventReload';
import VibRouteGenerator from '../shared/vib_route_generator';
import useSuperScript from '../shared/hooks/useSuperScript';

const AssessmentQuestionAnswer = ({
  courseAssessmentAttempt, vibCourseId, vibAssessmentAttemptId, intl,
}) => {
  useSuperScript();
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [promptMessage, setPromptMessage] = useState(intl.formatMessage({ id: 'assessment.areYouSure' }));

  usePreventReload(true);

  const [assessmentExamQuestionsState, assessmentExamDispatcher] = useReducer(assessmentExamReducer, examQuestionAnswerInitialState(courseAssessmentAttempt));
  const { currentQuestion } = assessmentExamQuestionsState;

  if (!(currentQuestion)) {
    return <Redirect to={VibRouteGenerator.getAssessmentPageUrl(vibCourseId, courseAssessmentAttempt.assessmentType)} />;
  }

  const handleSelectAnswer = (event) => {
    const selectedAnswer = find(currentQuestion.answers, { id: event.target.value });
    setSelectedAnswers([selectedAnswer]);
  };

  const getSelectedAnswers = () => {
    if (!isEmpty(selectedAnswers)) {
      return selectedAnswers;
    }
    return currentQuestion && [currentQuestion.submittedAnswer];
  };

  return (
    <>
      <Prompt message={promptMessage} />
      <div data-testid="question-answer-container" className={styles['question-answer-block']}>
        <QuestionAnswers
          questionData={currentQuestion}
          userAnswers={[]}
          selectedAnswers={getSelectedAnswers()}
          handleSelectAnswer={handleSelectAnswer}
          answersStyle={styles['answer-block']}
          questionsStyle={styles['question-block']}
        />
        <ActionsButtons
          key={currentQuestion.id}
          courseAssessmentAttempt={courseAssessmentAttempt}
          vibAssessmentAttemptId={vibAssessmentAttemptId}
          assessmentExamQuestionsState={assessmentExamQuestionsState}
          selectedAnswer={selectedAnswers[0] || (currentQuestion && currentQuestion.submittedAnswer)}
          courseId={vibCourseId}
          setSelectedAnswers={setSelectedAnswers}
          assessmentExamDispatcher={assessmentExamDispatcher}
          setPromptMessage={setPromptMessage}
        />
      </div>
    </>
  );
};

AssessmentQuestionAnswer.propTypes = {
  courseAssessmentAttempt: PropTypes.instanceOf(Object).isRequired,
  vibCourseId: PropTypes.string.isRequired,
  vibAssessmentAttemptId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default useIntl(
  AssessmentQuestionAnswer,
);
