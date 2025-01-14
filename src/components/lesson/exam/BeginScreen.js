import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';

import { useMutation } from '@apollo/react-hooks';
import { useHistory, Link } from 'react-router-dom';
import { truncate } from 'lodash';
import VibButton from '../../shared/vib_button';

import { vibGraphqlStates, flashMessageState } from '../../../../graphql_states';
import { RoundedChevronLeft, RoundedChevronRight } from '../../shared/vib_icons';

import styles from './questions/question.module.scss';

const BeginScreen = ({
  setExamAttempted,
  totalQuestion,
  isExamCompleted,
  levelTwoCollectionExamUserProgressId,
  lastLessonPath,
  lastLevelOneCollection,
}) => {
  const history = useHistory();

  const [updateExamProgress] = useMutation(
    vibGraphqlStates.question.mutations.UPDATE_EXAM_PROGRESS,
  );

  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  const handlePreviousSubmit = () => history.push(lastLessonPath);

  const createUserTopicExamProgress = () => {
    updateExamProgress({
      variables: {
        levelTwoCollectionExamUserProgressId,
      },
    }).then((response) => {
      if (response.data.updateExamProgress.success) {
        setExamAttempted(true);
      } else {
        updateFlashMessage({
          variables: {
            message: response.data.updateExamProgress.errorMessages,
            messageType: 'danger',
          },
        });
      }
    });
  };

  return (
    <>
      <div className="text-center mt-5 px-5 mx-5">
        {
          isExamCompleted ? (
            <h4 className="font-weight-bold">
              <h1 id="course.topics.exam.beginscreen.already_taken_exam" />
            </h4>
          ) : (
            <>
              <h4 className="font-weight-bold"><h1 id="course.topics.exam.beginscreen.congratulation" /></h4>
              <h4 className="font-weight-bold">
                <h1 id="course.topics.exam.beginscreen.completed_lesson_topic" />
              </h4>
              <p className={classNames(styles['begin-page-para-container'])}>
                <h1 id="course.topics.exam.beginscreen.short_topic_quiz" />
              </p>
            </>
          )
        }
      </div>
      {
        !isExamCompleted ? (
          <div
            className={classNames(styles['previous-next-block-container'], 'd-flex justify-content-between')}
          >
            <div className="d-flex align-items-center">
              <VibButton
                handleSubmit={handlePreviousSubmit}
                variant="secondary"
                classes={classNames(styles['next-prev-btn'], styles['prev-btn'])}
              >
                <RoundedChevronLeft fillColor="#fff" />
                <h1 id="button.back" />
              </VibButton>
              <span className={styles['practice-text']}>
                {truncate(lastLevelOneCollection.title, { length: 60, omission: ' ...' })}
              </span>
            </div>

            <VibButton
              handleSubmit={createUserTopicExamProgress}
              variant="secondary"
              classes={classNames(styles['next-prev-btn'], styles['prev-btn'])}
            >
              <h1 id="button.next" />
              <RoundedChevronRight fillColor="#fff" />
            </VibButton>
          </div>
        ) : null
      }
    </>
  );
};

BeginScreen.propTypes = {
  setExamAttempted: PropTypes.func.isRequired,
  totalQuestion: PropTypes.number.isRequired,
  isExamCompleted: PropTypes.bool.isRequired,
  levelTwoCollectionExamUserProgressId: PropTypes.string.isRequired,
  lastLessonPath: PropTypes.string.isRequired,
  lastLevelOneCollection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default BeginScreen;
