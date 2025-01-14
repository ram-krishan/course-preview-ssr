import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Col } from 'react-bootstrap';
import {
  isEmpty, get, find, orderBy,
} from 'lodash';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { vibGraphqlStates, flashMessageState } from '../../../../../graphql_states';
import PreviousNextBlock from './PreviousNextBlock';
import Question from '../../../shared/QuestionAnswers/Question';
import ExamAnswer from '../../../shared/QuestionAnswers/ExamAnswer';
import VibRouteGenerator from '../../../shared/vib_route_generator';
import useSuperScript from '../../../shared/hooks/useSuperScript';

import styles from './question.module.scss';
import ImageAssociatedContentWrapper from '../../shared/ImageAssociatedContentWrapper';

const QuestionAnswer = ({
  exam,
  examProgress,
  currentExamQuestion,
  setCurrentExamQuestion,
  isExamCompleted,
}) => {
  useSuperScript();

  const history = useHistory();

  const {
    question: {
      id: questionId,
      question,
      questionType,
      answers,
    },
    position: currentQuestionPosition,
  } = currentExamQuestion;

  const lastQuestion = orderBy(exam.examQuestions, ['type', 'position'], ['asc', 'desc'])[0];

  const submittedAnswerIds = () => {
    const submittedAnswer = find(
      examProgress.submittedAnswers,
      { questionId: currentExamQuestion.question.id },
    );
    return get(submittedAnswer, 'answerIds') || [];
  };

  const [selectedAnswerIds, setSelectedAnswerIds] = useState(submittedAnswerIds);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);
  const [isLoadingPrevQuestion, setIsLoadingPrevQuestion] = useState(false);

  const [updateFlashMessage] = useMutation(flashMessageState.mutations.UPDATE_FLASH_MESSAGE);
  const [createOrUpdateLevelTwoExamUserAnswer] = useMutation(
    vibGraphqlStates.question.mutations.CREATE_OR_UPDATE_LEVEL_TWO_EXAM_USER_ANSWER,
  );

  const isExamHasImage = !isEmpty(exam.image);
  const isMultiChoiceQuestion = questionType === 'multipleChoice';

  const progressIndicatorTextClasses = classNames(
    styles['complete-status'],
    'd-flex justify-content-center mt-4 font-weight-bold',
  );

  const questionContainerClasses = classNames(
    'container pt-2',
    isExamHasImage ? 'pl-0' : 'px-5',
  );

  const shouldDisplayBackToPreviousQuestionLink = () => (
    currentQuestionPosition !== 1
      && (currentQuestionPosition - 1) === examProgress.submittedAnswers.length
  );

  const handleToggleAnswer = (event) => {
    const targetAnswerId = event.target.value;
    if (isMultiChoiceQuestion) {
      if (event.target.checked) {
        setSelectedAnswerIds([...selectedAnswerIds, targetAnswerId]);
      } else {
        const filteredAnswerIds = selectedAnswerIds.filter(
          (answerId) => answerId !== targetAnswerId,
        );
        setSelectedAnswerIds(filteredAnswerIds);
      }
    } else {
      setSelectedAnswerIds([targetAnswerId]);
    }
  };

  const isExamCompletedAndRevisitedLastQuestion = (isAllCoreContentCompletedAndNoEnrichmentStart) => (
    isExamCompleted
    && currentExamQuestion.id === lastQuestion.id && isAllCoreContentCompletedAndNoEnrichmentStart
  );

  const isExamNotCompletedAndAllCoreContentCompleted = (isAllCoreContentCompletedAndNoEnrichmentStart) => (
    !isExamCompleted
    && isAllCoreContentCompletedAndNoEnrichmentStart
  );


  const handleClickOnNextQuestion = () => {
    if (isEmpty(selectedAnswerIds)) {
      return;
    }
    setIsLoadingNextQuestion(true);
    createOrUpdateLevelTwoExamUserAnswer({
      variables: {
        questionId,
        answerIds: selectedAnswerIds,
        levelTwoCollectionExamUserProgressId: examProgress.id,
      },
    }).then((response) => {
      const {
        success, errorMessages, learnPath, isAllCoreContentCompletedAndNoEnrichmentStart,
      } = response.data.createOrUpdateLevelTwoExamUserAnswer;

      if (success) {
        if (isExamCompletedAndRevisitedLastQuestion(isAllCoreContentCompletedAndNoEnrichmentStart) || isExamNotCompletedAndAllCoreContentCompleted(isAllCoreContentCompletedAndNoEnrichmentStart)) {
          history.push(VibRouteGenerator.getTodayPageUrl());
        } else {
          setIsLoadingNextQuestion(false);
          if (!isEmpty(learnPath)) {
            history.push(learnPath);
          } else {
            const nextExamQuestion = find(
              exam.examQuestions,
              { position: currentExamQuestion.position + 1 },
            );
            let ansCollection = [];
            if (isExamCompleted) {
              const ans = find(
                examProgress.submittedAnswers,
                { questionId: nextExamQuestion.question.id },
              );
              ansCollection = get(ans, 'answerIds') || [];
            }
            setSelectedAnswerIds(ansCollection);
            setCurrentExamQuestion(nextExamQuestion);
          }
        }
      } else {
        setIsLoadingNextQuestion(false);
        updateFlashMessage({ variables: { message: errorMessages, messageType: 'danger' } });
      }
    });
  };

  const handleClickOnPreviousQuestion = () => {
    setIsLoadingPrevQuestion(true);
    const previousExamQuestion = find(
      exam.examQuestions,
      { position: currentExamQuestion.position - 1 },
    );
    const submittedAnswer = find(examProgress.submittedAnswers,
      (sAnswer) => sAnswer.questionId === previousExamQuestion.question.id);
    setCurrentExamQuestion(previousExamQuestion);
    setSelectedAnswerIds(submittedAnswer.answerIds);
    setIsLoadingPrevQuestion(false);
  };

  return (
    <>
      <div className={progressIndicatorTextClasses} data-testid="progress-indicator">
        {`${currentQuestionPosition} of ${exam.totalQuestions}`}
      </div>

      <div className={questionContainerClasses}>
        <Row className="mx-0">
          {isExamHasImage ? (
            <Col lg={7} className="pl-0">
              <h5 data-testid="exam-image-title" className="font-weight-bold">{exam.image.title}</h5>
              <ImageAssociatedContentWrapper content={exam.image} />
            </Col>
          ) : null}

          <Col lg={isExamHasImage ? 5 : 12} className="mt-4">
            <Question questionText={question} />

            {answers.map((answer) => (
              <ExamAnswer
                key={answer.id}
                answer={answer}
                toggleCheckbox={handleToggleAnswer}
                selectedAnswerIds={selectedAnswerIds}
                disabled={isExamCompleted}
                enableMultiSelect={isMultiChoiceQuestion}
              />
            ))}
          </Col>
        </Row>
      </div>

      <div className={classNames(styles['previous-next-block-container'])}>
        <PreviousNextBlock
          key={currentExamQuestion.id}
          handleClickOnNextQuestion={handleClickOnNextQuestion}
          handleClickOnPreviousQuestion={handleClickOnPreviousQuestion}
          displayBackToPreviousQuestionLink={shouldDisplayBackToPreviousQuestionLink()}
          disableContinueButton={isEmpty(selectedAnswerIds)}
          isLoadingNextQuestion={isLoadingNextQuestion}
          isLoadingPrevQuestion={isLoadingPrevQuestion}
        />
      </div>
    </>
  );
};

QuestionAnswer.propTypes = {
  isExamCompleted: PropTypes.bool.isRequired,
  exam: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    image: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
    totalQuestions: PropTypes.number.isRequired,
    examQuestions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        position: PropTypes.number.isRequired,
        question: PropTypes.shape({
          id: PropTypes.string.isRequired,
          question: PropTypes.string.isRequired,
          questionType: PropTypes.string.isRequired,
          answers: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              answer: PropTypes.string.isRequired,
            }),
          ),
        }).isRequired,
      }),
    ),
  }).isRequired,
  examProgress: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    submittedAnswers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        answerIds: PropTypes.arrayOf(
          PropTypes.string.isRequired,
        ).isRequired,
        questionId: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  currentExamQuestion: PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    question: PropTypes.shape({
      id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      questionType: PropTypes.string.isRequired,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          answer: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  }).isRequired,
  setCurrentExamQuestion: PropTypes.func.isRequired,
};

export default QuestionAnswer;
