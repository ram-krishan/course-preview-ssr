import React, { useState } from 'react';
import classNames from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';
import { isEmpty, find } from 'lodash';
import { useParams } from 'react-router-dom';


import styles from '../../assessment_question/assessment-question.module.scss';
import QuestionAnswers from '../../shared/QuestionAnswers';
import ExamTimeLine from '../../assessment_question/ExamTimeLine';
import AlertMessage from '../../shared/AlertMessage';
import TitleBlock from '../../shared/pageTitle';
import VibButton from '../../shared/vib_button';
import Loader from '../../shared/Loader';
import useExamQuestionQuery from './AssessmentQuestionPreviewQuery';
import getExamQuestionFormattedData from './QuestionCmsDataFormatter';

const AssessmentQuestionPreview = () => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const {
    assessment_cms_id: assessmentCmsId,
    question_cms_id: assessmentQuestionCmsId,
    assessment_exam_cms_id: assessmentExamCmsId,
    locale,
  } = useParams();
  let formattedData = {};

  const {
    examContentData,
    questionContentData,
    assessmentContentData,
    loading,
    error,
  } = useExamQuestionQuery(assessmentCmsId, assessmentExamCmsId, assessmentQuestionCmsId, locale);

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

  if (examContentData && questionContentData && assessmentContentData) {
    formattedData = getExamQuestionFormattedData(assessmentContentData, examContentData, questionContentData);
  }

  const {
    question, exam, assessment, validExams,
  } = formattedData;
  const { assessmentCurrentExam, title } = assessment;

  const handleSelectAnswer = (event) => {
    const selectedAnswer = find(question.answers, { id: event.target.value });
    setSelectedAnswers([selectedAnswer]);
  };

  const getSelectedAnswers = () => {
    if (!isEmpty(selectedAnswers)) {
      return selectedAnswers;
    }
    return question && [question.submittedAnswer];
  };
  return (
    <Container className="p-0">
      <Row className="min-height-75vh pb-5 mb-4">
        <Col sm={12} className="pl-0">
          <Col md={12}>
            <div className={classNames(styles['content-container'], 'pb-4')}>
              <div className="w-100">
                <TitleBlock
                  label={assessmentCurrentExam.title}
                  pageTitle={title}
                  topTxtClassNames={styles['top-small-heading']}
                  bottomTxtClassNames={styles['bottom-title-txt']}
                />
              </div>

              <div className={classNames(styles['questions-count-panel'], 'w-100')}>
                <h1
                  id="assessment.numberOfQuestionsComplete"
                  values={{
                    completedQuestions: 1,
                    totalQuestions: exam.totalNoOfQuestions,
                  }}
                />
              </div>

              <ExamTimeLine exams={validExams} currentItem={assessmentCurrentExam} />
              <QuestionAnswers
                questionData={question}
                userAnswers={[]}
                selectedAnswers={getSelectedAnswers()}
                handleSelectAnswer={handleSelectAnswer}
                answersStyle={styles['answer-block']}
                questionsStyle={styles['question-block']}
                isCoursePreview
              />
              <div className="d-flex justify-content-end align-items-center pt-3">
                <VibButton
                  handleSubmit={() => {}}
                  variant="secondary"
                  classes={classNames(styles['goContinue-btn'])}
                >
                  <h1 id="button.continue" />
                </VibButton>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default AssessmentQuestionPreview;
