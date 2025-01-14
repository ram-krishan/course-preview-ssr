import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import TitleBlock from '../../shared/pageTitle';
import lessonPageStyles from '../lesson-page.module.scss';
import styles from './questions/question.module.scss';
import VibButton from '../../shared/vib_button';
import { RoundedChevronLeft, RoundedChevronRight } from '../../shared/vib_icons';

const ExamCompleted = ({
  lastLessonPath,
  levelTwoCollectionTitle,
  handleExamCompleted,
  contentType,
}) => {
  const history = useHistory();

  const getTopicHeading = () => (contentType === 'core'
    ? <h1 id="heading.learn" />
    : <h1 id="heading.reinforce" />);

  const handleBackBtn = () => {
    history.push(lastLessonPath);
  };

  return (
    <>
      <Row className="my-3 align-items-center">
        <Col md={8} className={classNames(lessonPageStyles['heading-container'])}>
          <TitleBlock
            label={getTopicHeading()}
            topicLabel={levelTwoCollectionTitle}
            topTxtClassNames={styles['topic-title']}
            topicLabelClassNames={styles['topic-label-styles']}
          />
        </Col>
      </Row>

      <h4 className={classNames('mt-5 p-4 text-center', styles['body-container'])}>
        <p className={classNames(styles['already-taken-text'], 'pt-2')}>
          <h1 id="course.exam.youHaveAlreadyTakenTheExam" />
        </p>
        <p className={classNames(styles['next-below-to-review'], 'pb-2')}>
          <h1 id="course.exam.selectNextBelowToReviewYourSelections" />
        </p>
      </h4>
      <div className="text-right mt-5 d-flex justify-content-between">
        <VibButton
          variant="secondary"
          classes={classNames(styles['next-prev-btn'], styles['prev-btn'])}
          handleSubmit={handleBackBtn}
        >
          <RoundedChevronLeft fillColor="#fff" />
          <h1 id="course.exam.examCompleted.button.back" />
        </VibButton>
        <VibButton
          variant="secondary"
          handleSubmit={handleExamCompleted}
          classes={classNames(styles['next-prev-btn'], styles['next-btn'])}
        >
          <h1 id="course.exam.examCompleted.button.next" />
          <RoundedChevronRight fillColor="#fff" />
        </VibButton>
      </div>
    </>
  );
};

ExamCompleted.propTypes = {
  lastLessonPath: PropTypes.string.isRequired,
  levelTwoCollectionTitle: PropTypes.string.isRequired,
  handleExamCompleted: PropTypes.func.isRequired,
  contentType: PropTypes.string.isRequired,
};
export default ExamCompleted;
