import React, { useState } from 'react';
import classNames from 'classnames';
import { Row, Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';

import AlertMessage from '../../shared/AlertMessage';
import Question from '../../shared/QuestionAnswers/Question';
import ExamAnswer from '../../shared/QuestionAnswers/ExamAnswer';

import Loader from '../../../components/shared/Loader';
import questionPreviewStyles from '../../lesson/lesson-page.module.scss';
import PreviousNextBlock from '../../lesson/exam/questions/PreviousNextBlock';
import useExamQuestionQuery from './QuestionPreviewQuery';
import { getExamQuestionFormattedData } from './QuestionCmsDataFormatter';

const QuestionPreview = () => {
  const [selectedAnswerIds, setSelectedAnswerIds] = useState([]);

  const { question_cms_id: questionCmsId, exam_id: examId, locale } = useParams();
  let formattedData = {};

  const {
    examContentData,
    questionContentData,
    loading,
    error,
  } = useExamQuestionQuery(examId, questionCmsId, locale);

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

  if (examContentData && questionContentData) {
    formattedData = getExamQuestionFormattedData(examContentData, questionContentData);
  }


  const { question, exam } = formattedData;

  const isExamHasImage = exam && !isEmpty(exam.image);
  const questionContainerClasses = classNames(
    'container pt-2',
    isExamHasImage ? 'pl-0' : 'px-5',
  );

  const isMultiChoiceQuestion = (ques) => ques.questionType === 'multipleChoice';

  const handleToggleAnswer = (event, ques) => {
    const targetAnswerId = event.target.value;
    if (isMultiChoiceQuestion(ques)) {
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

  return (
    !isEmpty(formattedData)
      ? (
        <>
          <div className={questionContainerClasses}>
            <Row className="mx-0">
              {
                isExamHasImage
                  ? (
                    <Col lg={7} className="pl-0">
                      <h5 data-testid="exam-image-title" className="font-weight-bold">{exam.image.title}</h5>
                      <img
                        src={exam.image.url}
                        alt="course-img"
                        width="95%"
                        height="350"
                      />
                    </Col>
                  )
                  : null
              }

              <Col lg={isExamHasImage ? 5 : 12} className="mt-4">
                <Question questionText={question.question} />
                {
                  question.answers.map((answer) => (
                    <ExamAnswer
                      key={answer.id}
                      answer={answer}
                      toggleCheckbox={(event) => handleToggleAnswer(event, question)}
                      selectedAnswerIds={selectedAnswerIds}
                      disabled
                      enableMultiSelect={isMultiChoiceQuestion(question)}
                      isCoursePreviewView
                    />
                  ))
                }
              </Col>
            </Row>
          </div>

          <div className={classNames(questionPreviewStyles['previous-next-block-container'])}>
            <PreviousNextBlock
              handleClickOnNextQuestion={() => {}}
              handleClickOnPreviousQuestion={() => {}}
              displayBackToPreviousQuestionLink={() => {}}
              disableContinueButton={false}
              isLoadingNextQuestion={false}
              isLoadingPrevQuestion={false}
            />
          </div>
        </>
      )
      : null
  );
};

export default QuestionPreview;
