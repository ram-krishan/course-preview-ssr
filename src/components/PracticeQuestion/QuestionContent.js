import React from 'react';
import classNames from 'classnames';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import styles from './practice-page.module.scss';
import VideoAssociatedContentWrapper from '../lesson/shared/VideoAssociatedContentWrapper';
import { useVideoSubTitles } from '../shared/hooks/useVideoSubtitles';
import Loader from '../shared/Loader';

const QuestionContent = ({ question, currentQuestionIndex, noOfQuestion }) => {
  const videoJsOptions = {
    poster: question.video && question.video.thumbnailUrl,
    controls: true,
    sources: [{
      src: question.video && question.video.fileUrl,
      type: question.video && question.video.contentType,
    }],
    width: '900',
    height: '400',
  };

  const {
    subtitles,
    loading,
  } = useVideoSubTitles(question.video?.subtitleCmsId);

  if (loading) return <Loader />;

  return (
    <>
      <Row className="align-items-center">
        <Col sm={10}>
          <span data-testid="question-text" className={classNames(styles['question-text'])}>
            {question ? question.question : null}
          </span>
        </Col>
        <Col sm={2}>
          <span data-testid="no-question" className={classNames(styles['no-question'])}>
            <h1 id="practicePage.heading.questionsOutOfTotalQuestions" values={{ currentQuestionIndex, noOfQuestion }} />
          </span>
        </Col>
      </Row>
      {question.isTextOrVedioPresent
        ? (
        <Row>
          <Col sm={12} className="pt-3">
            {
              question.video
                ? (
                  <VideoAssociatedContentWrapper
                    content={question.video}
                    videoOptions={videoJsOptions}
                    subtitles={subtitles}
                  />
                )
                : null
            }
            <div>
              {
                question.text
                  ? <div dangerouslySetInnerHTML={{ __html:  question.text.text }} />
                  : null
              }
            </div>
          </Col>
        </Row>
        ) : null}
    </>
  );
};

QuestionContent.propTypes = {
  currentQuestionIndex: PropTypes.number.isRequired,
  noOfQuestion: PropTypes.number.isRequired,
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isMultipleChoiceQuestion: PropTypes.bool.isRequired,
    isTextOrVedioPresent: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    question: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      feedback: PropTypes.string,
      isCorrectResponse: PropTypes.bool,
    })),
    text: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
    video: PropTypes.shape({
      contentType: PropTypes.string,
      fileUrl: PropTypes.string,
      title: PropTypes.string,
      thumbnailUrl: PropTypes.string,
    }),
  }).isRequired,
};
export default QuestionContent;
