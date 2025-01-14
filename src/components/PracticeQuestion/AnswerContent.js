import React from 'react';
import {
  compact, isEmpty, find,
} from 'lodash';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import PracticeQuestionAnswers from '../shared/practice_question_answer';
import styles from './practice-page.module.scss';

const AnswerContent = (
  {
    question,
    userAnswer,
    selectedAnswers,
    setSelectedAnswers,
    showLessonLink,
    showlockedLessonOrGetLessonLink,
  },
) => {
  const handleSelectAnswer = (event) => {
    const targetElement = event.target;
    const answer = find(question.answers, { id: targetElement.value });
    const alreadySelectedAnswers = !isEmpty(selectedAnswers) ? selectedAnswers : [];

    if (question.isMultipleChoiceQuestion) {
      if (targetElement.checked) {
        setSelectedAnswers([...selectedAnswers, answer]);
      } else {
        const filteredAnswers = alreadySelectedAnswers.filter((ans) => ans.id !== answer.id);
        setSelectedAnswers(filteredAnswers);
      }
    } else {
      setSelectedAnswers([answer]);
    }
  };

  return (
    <Row>
      <Col sm={12} className="pt-3">
        <PracticeQuestionAnswers
          question={question}
          questionsStyle={styles['question-text']}
          userAnswers={compact(userAnswer)}
          selectedAnswers={compact(selectedAnswers)}
          handleOnChange={(event) => handleSelectAnswer(event)}
          showFeedback
          disableAnswerOptions={userAnswer !== null}
          showLessonLink={showLessonLink}
          showlockedLessonOrGetLessonLink={showlockedLessonOrGetLessonLink}
        />
      </Col>
    </Row>
  );
};


AnswerContent.defaultProps = {
  userAnswer: [],
  selectedAnswers: [],
};

AnswerContent.propTypes = {
  setSelectedAnswers: PropTypes.func.isRequired,
  userAnswer: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  selectedAnswers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isMultipleChoiceQuestion: PropTypes.bool.isRequired,
    isTextOrVedioPresent: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    question: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      feedback: PropTypes.string,
      isCorrectResponse: PropTypes.bool.isRequired,
    })),
    text: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
    video: PropTypes.shape({
      contentType: PropTypes.string,
      fileUrl: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
  showLessonLink: PropTypes.bool.isRequired,
  showlockedLessonOrGetLessonLink: PropTypes.func.isRequired,
};
export default AnswerContent;
