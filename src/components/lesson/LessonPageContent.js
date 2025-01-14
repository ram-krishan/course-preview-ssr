import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { useHistory, useLocation } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { get, find, isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import Heading from './Heading';
import BlocksTimeLine from '../shared/blocks_time_line';
import Page from './Page';
import styles from './lesson-page.module.scss';
import VibRouteGenerator from '../shared/vib_route_generator';
import CourseSyllabusDockedView from './course_syllabus_docked_view';
import useCookie from '../shared/hooks/useCookie';
import useSuperScript from '../shared/hooks/useSuperScript';

const LessonPageContent = ({
  course,
  position,
  levelTwoCollection,
  levelOneCollection,
  levelTwoLevelOneCollections,
  courseId,
  hasExam,
  levelTwoCollectionProgressId,
  vibLevelTwoCollectionCourseId,
  currentLevelTwoCollectionCount,
  levelTwoCollectionCount,
}) => {
  useSuperScript();
  // useBreadCrumb('lesson', levelOneCollection.title);
  const history = useHistory();
  const location = useLocation();

  const [progressId, setProgressId] = useState(null);
  const [previousPageProgressData, setPreviousPageProgressData] = useState({});
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentSurveyQuestionId, setCurrentSurveyQuestionId] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const [courseSyllabusCollapsedView, updateCookie] = useCookie('courseSyllabusCollapsedView', 'false');

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setCurrentQuestionId(null);
    setCurrentSurveyQuestionId(null);
    setUserAnswers([]);
    setSelectedAnswers([]);
    setPreviousPageProgressData({});
    scrollToTop();
  }, [progressId]);

  const isBackPageTraverse = !isEmpty(location.state) && location.state.isBackPageTraverse;

  const nextTopicLesson = find(levelTwoLevelOneCollections, (levelTwoLevelOne) => levelTwoLevelOne.position === (position + 1));
  const nextItemTitle = () => {
    if (nextTopicLesson) {
      return (
        <h1
          id="heading.nextLessonTitle"
          values={{ nextLessonTitle: nextTopicLesson.levelOneCollection.title }}
        />
      );
    }
    return '';
  };

  const getCurrentTopicCountElement = () => (
    <h1
      id="label.lessonPage.levelTwoCollectionCompleteCount"
      values={{
        currentLevelTwoCollectionCount,
        levelTwoCollectionCount,
      }}
    />
  );

  const redirectToLesson = (levelOneCollectionObj) => {
    const levelTwoLevelOneCollection = levelTwoLevelOneCollections.find(
      (level) => level.levelOneCollection.id === levelOneCollectionObj.id && level.levelOneCollection.__typename === levelOneCollectionObj.__typename,
    );
    history.push(VibRouteGenerator.getLessonPageUrl(courseId, levelTwoLevelOneCollection.id, levelTwoCollectionProgressId));
  };

  function useTimeLine(array, idKey, titleKey, statusKey, typename) {
    return array.map((arr, index) => ({
      id: get(arr, idKey),
      title: get(arr, titleKey),
      status: get(arr, statusKey) || 'open',
      position: index + 1,
      __typename: get(arr, typename),
    }));
  }
  const { pages } = levelOneCollection;
  let currentPage = find(pages, (page) => page.pageProgress && ['inProgress', 'open'].includes(page.pageProgress.status));

  if (levelOneCollection.levelOneCollectionProgress && levelOneCollection.levelOneCollectionProgress.status === 'completed') {
    if (isBackPageTraverse) {
      currentPage = pages[pages.length - 1];
    } else {
      [currentPage] = pages;
    }
  }

  const isRequestForLessonPage = !isEmpty(history.location.state) && history.location.state.isL1CollectionRequestFromSyllabus;

  if (isRequestForLessonPage) {
    setProgressId(pages[0].pageProgress.id);
    history.push({
      state: { isRequestForLessonPage: false },
    });
  }

  if (progressId === null) {
    setProgressId(currentPage.pageProgress.id);
  }

  const isCourseSyllabusViewCollapsed = () => {
    return courseSyllabusCollapsedView === 'true';
  };

  const toggleCollapseExpandCourseSyllabus = () => {
    updateCookie(`${!isCourseSyllabusViewCollapsed()}`);
  };

  return (
    <>
      <div className={classNames('d-flex flex-wrap h-100')}>
        <div className={classNames(styles['lesson-wp'], isCourseSyllabusViewCollapsed() ? styles['syllabus-collapsed-view'] : '')}>
          <div className={classNames(styles['lesson-container'], 'pb-5 position-relative')}>
            <Heading
              currentPage={currentPage}
            />

            <BlocksTimeLine
              items={useTimeLine(levelTwoLevelOneCollections, 'levelOneCollection.id', 'levelOneCollection.title', 'levelOneCollection.levelOneCollectionProgress.status', 'levelOneCollection.__typename')}
              currentItem={levelOneCollection}
              currentTopicCount={getCurrentTopicCountElement()}
              onTimeLineItemChange={(levelOne) => { redirectToLesson(levelOne); }}
            >
              <Page
                courseId={courseId}
                levelOneCollection={levelOneCollection}
                progressId={progressId}
                setProgressId={setProgressId}
                previousPageProgressData={previousPageProgressData}
                setPreviousPageProgressData={setPreviousPageProgressData}
                currentQuestionId={currentQuestionId}
                setCurrentQuestionId={setCurrentQuestionId}
                currentSurveyQuestionId={currentSurveyQuestionId}
                setCurrentSurveyQuestionId={setCurrentSurveyQuestionId}
                userAnswers={userAnswers}
                setUserAnswers={setUserAnswers}
                selectedAnswers={selectedAnswers}
                setSelectedAnswers={setSelectedAnswers}
                levelTwoCollectionProgressId={levelTwoCollectionProgressId}
                hasExam={hasExam}
                vibLevelTwoCollectionCourseId={vibLevelTwoCollectionCourseId}
                levelTwoCollection={levelTwoCollection}
              />
            </BlocksTimeLine>
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
            <PerfectScrollbar className={classNames(styles['course-syllabus-scroller'], !isCourseSyllabusViewCollapsed() ? 'pr-2' : '')}>
              <CourseSyllabusDockedView showSyllabusHeading={false} isCourseSyllabusSideView />
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </>
  );
};

LessonPageContent.propTypes = {
  course: PropTypes.instanceOf(Object).isRequired,
  position: PropTypes.number.isRequired,
  levelTwoCollection: PropTypes.instanceOf(Object).isRequired,
  levelOneCollection: PropTypes.instanceOf(Object).isRequired,
  levelTwoLevelOneCollections: PropTypes.instanceOf(Array).isRequired,
  levelTwoCollectionProgressId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  hasExam: PropTypes.bool.isRequired,
  vibLevelTwoCollectionCourseId: PropTypes.string.isRequired,
  currentLevelTwoCollectionCount: PropTypes.number.isRequired,
  levelTwoCollectionCount: PropTypes.number.isRequired,
};

export default LessonPageContent;
