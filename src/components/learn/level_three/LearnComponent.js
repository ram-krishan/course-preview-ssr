import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import {
  get,
  find,
} from 'lodash';
import { Button } from 'react-bootstrap';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PerfectScrollbar from 'react-perfect-scrollbar';
import LevelTwoBreakPage from '../LevelTwoBreakPage';
import Loader from '../../../../components/shared/Loader';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { vibGraphqlStates } from '../../../../graphql_states';
import PageNotFound from '../../shared/PageNotFound';
import CourseSyllabusDockedView from '../../lesson/course_syllabus_docked_view';
import styles from '../learn-page.module.scss';
import useCookie from '../../shared/hooks/useCookie';
import { canShowAssessmentTitle } from '../util';

const LearnComponent = ({ lvl3CollectionCourseId, lvl3Lvl2CollectionId }) => {
  const [courseSyllabusCollapsedView, updateCookie] = useCookie('courseSyllabusCollapsedView', 'false');

  const { data, error, loading } = useQuery(
    vibGraphqlStates.learn.levelThree.queries.GET_VIB_LEVEL_THREE_COLLECTION_COURSE,
    {
      variables: {
        vibLevelThreeCollectionCourseId: lvl3CollectionCourseId,
        vibLevelThreeLevelTwoCollectionId: lvl3Lvl2CollectionId,
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
    previousCompletedLevelTwoCollection,
    levelThreeCourse: {
      courseId,
      jumpBackIn,
      userCourseProgress,
      assessment,
      hasEnrichmentStarted,
      isAllCoreContentCompleted,
      currentCourseLevelThreeCollection,
      currentLevelThreeLevelTwoCollection,
      canStartCourse,
      isCourseEnabled,
    },
  } = data.vibLevelThreeCollectionCourse;

  const currentLvl3CollectionCourse = currentCourseLevelThreeCollection;
  if (!currentLvl3CollectionCourse.isUserAllowToVisit || !canStartCourse || !isCourseEnabled) {
    return (
      <PageNotFound />
    );
  }

  const currentLevelTwoCollection = () => currentLevelThreeLevelTwoCollection.levelTwoCollection;


  const lvlTwoCollectionProgress = (lvlThreeCollectionCourse, lvlTwoCollectionId) => {
    const lvl2CollectionProgresses = get(lvlThreeCollectionCourse, 'levelThreeCollectionProgress.levelTwoCollectionProgresses');

    return (find(
      lvl2CollectionProgresses, { levelTwoCollectionId: lvlTwoCollectionId },
    ));
  };

  const isProgressStarted = (progressObject) => {
    const startedStatuses = ['inProgress', 'completed'];
    return startedStatuses.includes(get(progressObject, 'status'));
  };

  const currentLvl2Collection = currentLevelTwoCollection();
  const lvl2CollectionProgress = lvlTwoCollectionProgress(currentLvl3CollectionCourse, currentLvl2Collection.id);
  const lvl2CollectionProgressId = lvl2CollectionProgress !== undefined ? lvl2CollectionProgress.id : '';

  const isCourseSyllabusViewCollapsed = () => courseSyllabusCollapsedView === 'true';
  const { firstLevelOneCollection } = currentLvl2Collection;

  const toggleCollapseExpandCourseSyllabus = () => {
    updateCookie(`${!isCourseSyllabusViewCollapsed()}`);
  };

  return (
    <div className="d-flex flex-wrap h-100">
      <div className={classNames(styles['lesson-wp'], isCourseSyllabusViewCollapsed() ? styles['syllabus-collapsed-view'] : '')}>
        <div data-testid="level-three-learn-component" className={classNames(styles['learn-container'], 'position-relative')}>
          <LevelTwoBreakPage
            jumpBackIn={jumpBackIn}
            assessment={assessment}
            isLearnStartPage={!isProgressStarted(userCourseProgress)}
            isAllCoreContentCompleted={isAllCoreContentCompleted}
            hasEnrichmentStarted={hasEnrichmentStarted}
            previousLevelTwoCollection={previousCompletedLevelTwoCollection}
            canShowAssessmentTitle={canShowAssessmentTitle(previousCompletedLevelTwoCollection)}
            courseId={courseId}
            firstLevelTwoLevelOneCollectionId={currentLvl2Collection.firstLevelTwoLevelOneCollection.id}
            firstLevelOneCollection={firstLevelOneCollection}
            levelTwoCollectionProgressId={lvl2CollectionProgressId}
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
            <CourseSyllabusDockedView showSyllabusHeading={false} isCourseSyllabusSideView courseId={courseId} />
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

LearnComponent.propTypes = {
  lvl3CollectionCourseId: PropTypes.string.isRequired,
  lvl3Lvl2CollectionId: PropTypes.string.isRequired,
};

export default LearnComponent;
