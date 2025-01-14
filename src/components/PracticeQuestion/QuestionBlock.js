import React, { useState } from 'react';
import {
  isEmpty, compact,
} from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import LaunchIcon from '@material-ui/icons/Launch';
import classNames from 'classnames';
import { LockIcon } from '../shared/vib_icons';
import QuestionContent from './QuestionContent';
import AnswerContent from './AnswerContent';
import FeedbackButton from './FeedbackButton';
import PracticeBoard from './PracticeBoard';
import NotSelectAllCorrectAnswersMsg from '../shared/QuestionAnswers/NotSelectAllCorrectAnswersMsg';
import CardWrapper from '../shared/card_wrapper';
import styles from '../shared/practice_question_answer/style.module.scss';
import useSuperScript from '../shared/hooks/useSuperScript';

const QuestionBlock = ({
  currentPracticeQuestionIndex,
  noOfQuestion,
  userAnswer,
  selectedAnswers,
  setSelectedAnswers,
  setUserAnswer,
  vibUserCoursePractice,
  coursePracticeSessionId,
  currentPracticeQuestion,
  setCoursePracticeSessionId,
  takingAllMeasurementCategories,
}) => {
  useSuperScript();

  const [lessonLink, setLessonsLink] = useState('');
  const [showLessonLink, setShowLessonsLink] = useState(false);

  const { question, confidenceOfResponse } = currentPracticeQuestion;

  const isMultiSelect = question.isMultipleChoiceQuestion;

  const lockedLesson = (id) => (
    <p key={id} className={classNames(styles['lesson-unlocked-text'], 'd-flex align-items-center')}>
      <LockIcon />
      <span className="pl-2"><FormattedMessage id="practicePage.feedback.lessonLocked" /></span>
    </p>
  );

  const getLessonLink = (link) => (
    <p className={styles['lesson-question-text']}>
      <FormattedMessage id="practicePage.feedback.heading.seeTheLessonQuestionComesFrom" />
      <Link to={link} target="_blank">
        <LaunchIcon className="ml-1" />
      </Link>
    </p>
  );

  const showlockedLessonOrGetLessonLink = () => (
    lessonLink === ''
      ? lockedLesson()
      : getLessonLink(lessonLink)
  );

  const shouldShowNotSelectAllCorrectAnswersMsg = () => {
    if (isMultiSelect) {
      if (selectedAnswers.length === 0) {
        return false;
      }
      const allCorrectAnswersLength = question.answers.filter((answer) => answer.isCorrectResponse).length;
      const selectedCorrectAnswersLength = selectedAnswers.filter((answer) => answer.isCorrectResponse).length;
      return (selectedCorrectAnswersLength != allCorrectAnswersLength);
    }
  };

  const getNotSelectAllCorrectAnswersMsg = () => (
    shouldShowNotSelectAllCorrectAnswersMsg() ? <NotSelectAllCorrectAnswersMsg /> : null
  );

  return (
    <div data-testid="question-block" className="p-4">
      <QuestionContent
        question={question}
        currentQuestionIndex={currentPracticeQuestionIndex}
        noOfQuestion={noOfQuestion}
      />
      <AnswerContent
        question={question}
        userAnswer={userAnswer}
        selectedAnswers={selectedAnswers}
        setSelectedAnswers={setSelectedAnswers}
        showLessonLink={showLessonLink}
        showlockedLessonOrGetLessonLink={showlockedLessonOrGetLessonLink}
      />
      {
        isEmpty(userAnswer)
          ? (
            <FeedbackButton
              confidenceOfResponse={confidenceOfResponse}
              setUserAnswer={setUserAnswer}
              selectedAnswers={selectedAnswers}
              setCoursePracticeSessionId={setCoursePracticeSessionId}
              currentPracticeQuestion={currentPracticeQuestion}
              currentPracticeQuestionIndex={currentPracticeQuestionIndex}
              coursePracticeSessionId={coursePracticeSessionId}
              setLessonsLink={setLessonsLink}
              setShowLessonsLink={setShowLessonsLink}
              takingAllMeasurementCategories={takingAllMeasurementCategories}
            />
          )
          : getNotSelectAllCorrectAnswersMsg()
      }

      { isMultiSelect && !isEmpty(compact(userAnswer))
        ? (
          <div>
            <div className="mt-4">
              <CardWrapper
                boxShadow="0 2px 37px 8px #EDE9E7"
                borderRadius="5px"
                classes="d-flex align-items-center"
              >
                <CardWrapper.Body>
                  <div className="p-4">
                    <span
                      dangerouslySetInnerHTML={{ __html: question.explanation }}
                    />
                    {showLessonLink ? showlockedLessonOrGetLessonLink() : null}
                  </div>
                </CardWrapper.Body>
              </CardWrapper>
            </div>
          </div>
        )
        : null}

      <PracticeBoard
        vibUserCoursePractice={vibUserCoursePractice}
        coursePracticeSessionId={coursePracticeSessionId}
      />
    </div>
  );
};

QuestionBlock.defaultProps = {
  userAnswer: [],
  selectedAnswers: [],
  coursePracticeSessionId: '',
};

QuestionBlock.propTypes = {
  currentPracticeQuestionIndex: PropTypes.number.isRequired,
  noOfQuestion: PropTypes.number.isRequired,
  userAnswer: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  selectedAnswers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  setSelectedAnswers: PropTypes.func.isRequired,
  setUserAnswer: PropTypes.func.isRequired,
  vibUserCoursePractice: PropTypes.shape({
    id: PropTypes.string.isRequired,
    streakCount: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      totalActivityPoints: PropTypes.number,
    }).isRequired,
  }).isRequired,
  coursePracticeSessionId: PropTypes.string,
  setCoursePracticeSessionId: PropTypes.func.isRequired,
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
        title: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  }).isRequired,
  takingAllMeasurementCategories: PropTypes.bool.isRequired,
};

export default QuestionBlock;
