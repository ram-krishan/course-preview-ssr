import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import { Button } from 'react-bootstrap';
import {
  get,
  find,
  findIndex,
} from 'lodash';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PerfectScrollbar from 'react-perfect-scrollbar';
import LevelTwoBreakPage from './LevelTwoBreakPage';
import Loader from '../../../components/shared/Loader';
import AlertMessage from '../../../components/shared/AlertMessage';
import { vibGraphqlStates } from '../../../graphql_states';
import PageNotFound from '../shared/PageNotFound';

import styles from './learn-page.module.scss';
import CourseSyllabusDockedView from '../lesson/course_syllabus_docked_view';
import useCookie from '../shared/hooks/useCookie';

const LearnComponent = ({ courseId, levelTwoCollectionCourseId, locale }) => {
  const [courseSyllabusCollapsedView, updateCookie] = useCookie('courseSyllabusCollapsedView', 'false');

  const { data, error, loading } = useQuery(
    vibGraphqlStates.learn.queries.GET_VIB_LEVEL_TWO_COURSE,
    {
      variables: {
        vibCourseId: courseId,
        vibLevelTwoCollectionCourseId: levelTwoCollectionCourseId,
        locale: locale
      },
      fetchPolicy: 'network-only',
    },
  );

  if (loading) return <Loader />;

  if (error) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="mt-3"
        message={error.graphQLErrors}
      />
    );
  }
  const {
    jumpBackIn,
    userCourseProgress,
    currentCourseLevelTwoCollection,
    previousCourseLevelTwoCollection,
    assessment,
    isAllCoreContentCompleted,
    hasEnrichmentStarted,
    canShowAssessmentTitle,
    canStartCourse,
    isCourseEnabled,
  } = data.vibLevelTwoCourse;

  const currentLvl2CollCourse = currentCourseLevelTwoCollection;
  const previousLv2CollCourse = previousCourseLevelTwoCollection;

  if (!currentLvl2CollCourse.isUserAllowToVisit || !canStartCourse || !isCourseEnabled) {
    return (<PageNotFound />);
  }

  const previousLevelTwoCollection = get(previousLv2CollCourse, 'levelTwoCollection');
  const currentLevelTwoCollection = get(currentLvl2CollCourse, 'levelTwoCollection');

  const firstLevelTwoLevelOneCollection = currentLevelTwoCollection.firstLevelTwoLevelOneCollection;
  const firstLevelOneCollection = firstLevelTwoLevelOneCollection.levelOneCollection;

  const isProgressStarted = (progressObject) => {
    const startedStatuses = ['inProgress', 'completed'];
    return startedStatuses.includes(get(progressObject, 'status'));
  };

  const isCourseSyllabusViewCollapsed = () => courseSyllabusCollapsedView === 'true';

  const toggleCollapseExpandCourseSyllabus = () => {
    updateCookie(`${!isCourseSyllabusViewCollapsed()}`);
  };
  const lvl2CollectionProgressId = currentLvl2CollCourse.levelTwoCollectionProgress !== null ? currentLvl2CollCourse.levelTwoCollectionProgress.id : '';

  return (
    <div className="d-flex flex-wrap h-100">
      <div className={classNames(styles['lesson-wp'], isCourseSyllabusViewCollapsed() ? styles['syllabus-collapsed-view'] : '')}>
        <div data-testid="learn-container" className={classNames(styles['learn-container'], 'position-relative')}>
          <LevelTwoBreakPage
            jumpBackIn={jumpBackIn}
            assessment={assessment}
            isLearnStartPage={!isProgressStarted(userCourseProgress)}
            hasEnrichmentStarted={hasEnrichmentStarted}
            isAllCoreContentCompleted={isAllCoreContentCompleted}
            previousLevelTwoCollection={previousLevelTwoCollection}
            courseId={courseId}
            levelTwoCollectionProgressId={lvl2CollectionProgressId}
            firstLevelTwoLevelOneCollectionId={firstLevelTwoLevelOneCollection.id}
            firstLevelOneCollection={firstLevelOneCollection}
            canShowAssessmentTitle={canShowAssessmentTitle}
          />
          <hr />
        </div>
      </div>
      <div className={classNames(styles['course-index-content'], isCourseSyllabusViewCollapsed() ? styles['course-syllabus-collapsed'] : styles['course-syllabus-expanded'])}>
        <div>
          <Button variant="light" className={styles['course-syllabus-toggle-btn']} onClick={toggleCollapseExpandCourseSyllabus}>
            {!isCourseSyllabusViewCollapsed()
              ? <ChevronRightIcon className={styles['collapse-icon']} /> : <ChevronLeftIcon className={styles['collapse-icon']} />}
          </Button>
        </div>
        <div className={styles['scroll-body']}>
          <PerfectScrollbar className={classNames(styles['course-syllabus-scroller'], !isCourseSyllabusViewCollapsed() ? 'pr-3' : '')}>
            <CourseSyllabusDockedView showSyllabusHeading={false} isCourseSyllabusSideView />
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

LearnComponent.propTypes = {
  courseId: PropTypes.string.isRequired,
  levelTwoCollectionCourseId: PropTypes.string.isRequired,
};

export default LearnComponent;
