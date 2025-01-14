import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useMutation } from '@apollo/react-hooks';
import { Link, useHistory } from 'react-router-dom';

import VibButton from '../shared/vib_button';
import TitleBlock from '../shared/pageTitle';
import { vibGraphqlStates, flashMessageState } from '../../../graphql_states';

import styles from './learn-page.module.scss';

const Lesson = ({
  courseId,
  jumpBackIn,
  isLearnStartPage,
  canStartCourse,
  isCourseEnabled,
}) => {
  const history = useHistory();

  const [startCourse, { loading }] = useMutation(
    vibGraphqlStates.learn.mutations.START_COURSE,
  );
  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  const [createUserActivityLog] = useMutation(
    vibGraphqlStates.userActivityLog.mutations.CREATE_USER_ACTIVITY_LOG,
  );

  const handleStartCourse = () => {
    startCourse({
      variables: { vibCourseId: courseId },
    }).then((response) => {
      const {
        success,
        errorMessages,
        jumpBackIn: jumpBackInResponse,
      } = response.data.startCourse;

      if (success) {
        history.push({ pathname: jumpBackInResponse.jumpBackInPath });
      } else {
        updateFlashMessage({
          variables: {
            message: errorMessages,
            messageType: 'danger',
          },
        });
      }
    });
  };

  const getCourseButtonClass = (isLoading) => (isLoading ? 'loading' : '');

  const renderStartCourseButton = () => (
    <VibButton
      variant="primary"
      classes={classNames(styles['jump-button'], styles[getCourseButtonClass(loading)])}
      handleSubmit={handleStartCourse}
      isDisabled={!isCourseEnabled || !canStartCourse}
      isLoading={loading}
    >

      <h1 id="button.start" />
    </VibButton>
  );

  const trackUserActivityLog = () => {
    createUserActivityLog({
      variables: {
        targetUrl: jumpBackIn.jumpBackInPath,
      },
    });
  };

  const renderJumpBackInButton = () => (
    <Link
      data-testid="jump-back-in-link"
      to={jumpBackIn.jumpBackInPath}
      role="button"
      className={classNames(
        styles['jump-btn'],
        `btn btn-danger small_fontsize px-4 py-3 ${!isCourseEnabled ? 'disabled' : ''}`,
      )}
      onClick={trackUserActivityLog}
    >
      <h1 id="button.nextActivity" />
    </Link>
  );

  return (
    <>
      <TitleBlock
        label=""
        pageTitle={jumpBackIn.levelTwoCollectionDescriptionTitle}
        courseTitle=""
        topTxtClassNames={styles['small-txt-style']}
        middleTxtClassNames={styles['middle-txt-style']}
      />

      <div
        dangerouslySetInnerHTML={{ __html: jumpBackIn.levelTwoCollectionDescription }}
        data-testid="course-description"
        className={classNames(styles['course-description'], 'small_fontsize')}
      />

      <div
        className={classNames(
          styles['course-description'],
          'd-flex justify-content-between mt-3',
        )}
      >
        <div>
          <span className={styles['lesson-no-indication']} data-testid="total-lesson-indication">
            <h1
              id="label.courseIndex.levelOneCollectionCompleteCount"
              values={{
                completedLevelOneCollectionCount: jumpBackIn.completedLevelOneCollectionCount,
                levelOneCollectionCount: jumpBackIn.levelOneCollectionCount,
              }}
            />
          </span>
        </div>

        {isLearnStartPage ? renderStartCourseButton() : renderJumpBackInButton()}
      </div>
    </>
  );
};

Lesson.defaultProps = {
  jumpBackIn: ({
    jumpBackInPath: '',
  }),
  isCourseEnabled: false,
};

Lesson.propTypes = {
  courseId: PropTypes.string.isRequired,
  jumpBackIn: PropTypes.shape({
    courseTitle: PropTypes.string.isRequired,
    levelTwoCollectionTitle: PropTypes.string.isRequired,
    jumpBackInTitle: PropTypes.string.isRequired,
    jumpBackInDesc: PropTypes.string,
    jumpBackInPath: PropTypes.string,
    levelOneCollectionCount: PropTypes.number.isRequired,
    completedLevelOneCollectionCount: PropTypes.number.isRequired,
  }),
  isLearnStartPage: PropTypes.bool.isRequired,
  canStartCourse: PropTypes.bool.isRequired,
  isCourseEnabled: PropTypes.bool,
};

export default Lesson;
