/* eslint-disable react/jsx-indent-props */
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';

import AlertMessage from '../../shared/AlertMessage';
import usePracticeQuestionQuery from './PracticeQuestionPreviewQuery';
import Loader from '../../shared/Loader';
import getPracticeQuestionFormattedData from './PracticeQuestionCmsDataFormatter';
import QuestionContent from '../../PracticeQuestion/QuestionContent';
import AnswerList from '../../shared/practice_question_answer/AnswerList';

const PracticeQuestionPreview = () =>{
  const {
    practice_question_cms_id: practiceQuestionCmsId,
    locale,
  } = useParams();
  let formattedData = {};

  const {
    practiceQuestionData,
    loading,
    error,
  } = usePracticeQuestionQuery(practiceQuestionCmsId, locale);

  if (loading) return <Loader />;

  if (error) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="m-3"
        message={!isEmpty(error) && error.graphQLErrors}
      />
    );
  }

  if (practiceQuestionData) {
    formattedData = getPracticeQuestionFormattedData(practiceQuestionData);
  }

  return (
    <Container className="p-0">
      <Row className="min-height-75vh pb-5 mb-4">
        <Col sm={12} className="pl-0">
          <QuestionContent
            question={formattedData.question}
            currentQuestionIndex={1}
            noOfQuestion={1}
          />
          <AnswerList
            answers={formattedData.question.answers}
            userAnswers={formattedData.question.answers}
            selectedAnswers={formattedData.question.answers}
            handleOnChange={() => console.log('selected')}
            showFeedback
            isMultiSelect={false}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PracticeQuestionPreview;
