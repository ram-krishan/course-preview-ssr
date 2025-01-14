import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';
import PreviousNextBlock from './PreviousNextBlock';
import Question from '../../../shared/QuestionAnswers/Question';
import ExamAnswer from '../../../shared/QuestionAnswers/ExamAnswer';
import useSuperScript from '../../../shared/hooks/useSuperScript';

import styles from './question.module.scss';
import ImageAssociatedContentWrapper from '../../../lesson/shared/ImageAssociatedContentWrapper';
import { formatCollection } from '../../Course/shared';
import { formateContentComponent } from '../../PagePreview/pageCmsDataFormatter';
import { questionPreview } from '../../../../graphql_states/contentstack';
import { getFormattedQuestion } from '../../QuestionPreview/QuestionCmsDataFormatter';

import Loader from '../../../shared/Loader';

const QuestionAnswer = ({
  position: currentQuestionPosition,
  exam,
  associatedContent,
  currentExamQuestion,
  setCurrentExamQuestion,
  totalQuestionsCount,
  nextL2,
  lastLessonPath,
  questions,
  imageConnection,
  locale,
}) => {
  useSuperScript();
  const history = useHistory();
  const client = useApolloClient();
  const {
    question,
    questionType,
  } = currentExamQuestion;
  const questionId = currentExamQuestion.system.uid;
  const lastQuestion = questions.slice(-1)[0];
  const isLastQuestion = questionId === lastQuestion.system.uid;
  const mainConnection = formatCollection(imageConnection)[0];
  let imageContent = null;

  const image = mainConnection ? formatCollection(mainConnection.imageConnection)[0] : null;
  const [loadingContent, setLoadingContent] = useState(true);
  const [questionAnswers, setQuestionAnswers] = useState(null);

  const asyncFetch = async () => {
    const questionContent = await client.query({
      query: questionPreview.queries.GET_TOPIC_EXAM_QUESTION_CONTENT,
      variables: {
        questionCmsId: questionId,
        locale,
      },
      fetchPolicy: 'network-only',
    });
    setQuestionAnswers(getFormattedQuestion(questionContent.data));
    setLoadingContent(false);
  };

  useEffect(() => {
    asyncFetch();
  }, [questionId]);

  if (loadingContent) return <Loader />;

  const isExamHasImage = !isEmpty(image);
  if (isExamHasImage) {
    const associatedContentPosition = mainConnection.associated_content_position;
    imageContent = {
      url: image.url,
      title: image.title,
      showAssociatedContent: mainConnection.show_associated_content_,
      associatedContentWidth: !isEmpty(associatedContentPosition) ? mainConnection.associated_content_position.width : null,
      associatedContentPosition: !isEmpty(associatedContentPosition) ? mainConnection.associated_content_position.position : null,
      associatedContent: associatedContent && associatedContent.associated_content.components.map(
        (mainContentData) => formateContentComponent(mainContentData, {}),
      ),
    };
  }
  const isMultiChoiceQuestion = questionType === 'multipleChoice';

  const progressIndicatorTextClasses = classNames(
    styles['complete-status'],
    'd-flex justify-content-center mt-4 font-weight-bold',
  );

  const questionContainerClasses = classNames(
    'container pt-2',
    isExamHasImage ? 'pl-0' : 'px-5',
  );

  const handleClickOnNextQuestion = () => {
    if (isLastQuestion) {
      history.push(nextL2);
    } else {
      setCurrentExamQuestion(questions[currentQuestionPosition + 1]);
    }
  };

  const handleClickOnPreviousQuestion = () => {
    if (currentQuestionPosition === 0) {
      history.push(lastLessonPath);
    } else {
      setCurrentExamQuestion(questions[currentQuestionPosition - 1]);
    }
  };

  return (
    <>
      <div className={progressIndicatorTextClasses} data-testid="progress-indicator">
        {`${currentQuestionPosition} of ${totalQuestionsCount}`}
      </div>

      <div className={questionContainerClasses}>
        <Row className="mx-0">
          {isExamHasImage ? (
            <Col lg={7} className="pl-0">
              <h5 data-testid="exam-image-title" className="font-weight-bold">{image.title}</h5>
              <ImageAssociatedContentWrapper
                content={imageContent}
              />
            </Col>
          ) : null}

          <Col lg={isExamHasImage ? 5 : 12} className="mt-4">
            <Question questionText={questionAnswers.question} />
            {
              questionAnswers.answers.map((answer) => (
                <ExamAnswer
                  key={answer.id}
                  answer={answer}
                  toggleCheckbox={() => {}}
                  selectedAnswerIds={[]}
                  disabled
                  enableMultiSelect={isMultiChoiceQuestion}
                  isCoursePreviewView
                />
              ))
            }
          </Col>
        </Row>
      </div>

      <div className={classNames(styles['previous-next-block-container'])}>
        <PreviousNextBlock
          key={questionAnswers.id}
          handleClickOnNextQuestion={handleClickOnNextQuestion}
          handleClickOnPreviousQuestion={handleClickOnPreviousQuestion}
          displayBackToPreviousQuestionLink
          nextDisable={isLastQuestion && isEmpty(nextL2)}
        />
      </div>
    </>
  );
};

QuestionAnswer.propTypes = {
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
