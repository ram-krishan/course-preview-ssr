import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { isEmpty, find, last } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './course-syllabus-docked-view-style.module.scss';
import SyllabusCollapsePanel from './SyllabusCollapsePanel';
import '../../assets/css/common-style.css';
import Loader from '../../../../components/shared/Loader';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { vibGraphqlStates } from '../../../../graphql_states';
import './styles.css';
import PageNotFound from '../../shared/PageNotFound';
import LeaderMessageContainer from './LeaderMessageContainer';

const CourseSyllabusDockedView = ({
  showSyllabusHeading,
  courseId: id,
  isCourseSyllabusSideView,
}) => {
  const [activeKeys, setActiveKeys] = useState([]);
  let { vib_course_id: courseId } = useParams();

  if (!showSyllabusHeading && isEmpty(courseId)) {
    courseId = id;
  }

  const { data, error, loading } = useQuery(
    vibGraphqlStates.courseSyllabus.queries.GET_COURSE_SYLLABUS,
    {
      variables: {
        vibCourseId: courseId,
      },
      fetchPolicy: 'network-only',
    },
  );
  if (loading) return <div className="text-center"><Loader /></div>;
  if (error) {
    const errorObject = error;
    return (
      <AlertMessage
        alertType="danger"
        customClass="mt-3"
        message={errorObject && errorObject.graphQLErrors}
      />
    );
  }

  const {
    jumpBackIn, levelCourse, courseProgress,
    canStartCourse,
    isCourseEnabled,
    title: courseTitle,
  } = data.cmsCourse;

  if (!isCourseEnabled) {
    return (
      <PageNotFound />
    );
  }
  if (!jumpBackIn) {
    return (
      <Container className="p-0">
        <Row className="mx-0 min-height-75vh">
          <Col sm={10} className={classNames(styles['bg-white'], 'p-0 pr-4 content-container')}>
            <h3 className="text-center mt-2">
              <FormattedMessage id="message.noTopicAvailableForCourse" />
            </h3>
          </Col>
        </Row>
      </Container>
    );
  }

  const isLevelCollectionInProgress = (status) => ['inProgress', 'open'].includes(status);

  const getCurrentLevelTwoCollection = (collection) => (
    find(collection, (levelTwoCollection) => levelTwoCollection.levelTwoCollectionProgress && isLevelCollectionInProgress(levelTwoCollection.levelTwoCollectionProgress.status))
  );

  const getCurrentLevelThreeCollection = (collection) => (
    find(collection, (levelThreeCollection) => levelThreeCollection.levelThreeCollectionProgress && levelThreeCollection.levelThreeCollectionProgress.status === 'inProgress')
  );

  const getInProgressLevelCollection = (coreCollections, enrichmentCollections, levelProgressStr) => {
    const inProgressCoreCollection = coreCollections.find(
      (coreCollection) => coreCollection[levelProgressStr] && coreCollection[levelProgressStr].status === 'inProgress',
    );

    if (inProgressCoreCollection) return inProgressCoreCollection;

    const inProgressEnrichmentCollection = enrichmentCollections.find(
      (enrichmentCollection) => enrichmentCollection[levelProgressStr] && enrichmentCollection[levelProgressStr].status === 'inProgress',
    );

    if (inProgressEnrichmentCollection) return inProgressEnrichmentCollection;
  };


  const getCompletedLevelCollections = (coreCollections, enrichmentCollections, levelProgressStr) => {
    const completedEnrichmentCollections = enrichmentCollections.filter(
      (enrichmentCollection) => enrichmentCollection[levelProgressStr] && enrichmentCollection[levelProgressStr].status === 'completed',
    );

    if (!isEmpty(completedEnrichmentCollections)) return completedEnrichmentCollections;

    const completedCoreCollections = coreCollections.filter(
      (coreCollection) => coreCollection[levelProgressStr] && coreCollection[levelProgressStr].status === 'completed',
    );

    if (!isEmpty(completedCoreCollections)) return completedCoreCollections;
  };


  const getLastOrFirstLevelCollection = (coreCollections, enrichmentCollections, levelProgressStr) => {
    // if course not started return first level collection
    if (!coreCollections[0][levelProgressStr]) return (coreCollections[0]);

    const currentInProgressCollection = getInProgressLevelCollection(coreCollections, enrichmentCollections, levelProgressStr);
    if (currentInProgressCollection) return currentInProgressCollection;

    const completedLevelCollections = getCompletedLevelCollections(coreCollections, enrichmentCollections, levelProgressStr);

    return last(completedLevelCollections);
  };


  const getCurrentLevelThreeLevelTwoCollection = (levelThreeCollectionProgress, levelThreeLevelTwoCollections) => {
    if (!isEmpty(levelThreeCollectionProgress)) {
      const { levelTwoCollectionProgresses } = levelThreeCollectionProgress;
      let currentLevelTwoCollectionProgress = levelTwoCollectionProgresses.find(
        (levelTwoCollectionProgress) => levelTwoCollectionProgress.status === 'inProgress',
      );
      let levelTwoCollectionId;

      if (!isEmpty(currentLevelTwoCollectionProgress)) {
        levelTwoCollectionId = currentLevelTwoCollectionProgress.levelTwoCollectionId;
      } else {
        currentLevelTwoCollectionProgress = last(levelTwoCollectionProgresses);
        levelTwoCollectionId = currentLevelTwoCollectionProgress.levelTwoCollectionId;
      }

      return levelThreeLevelTwoCollections.find(
        (levelThreeLevelTwoCollection) => levelThreeLevelTwoCollection.levelTwoCollection.id === levelTwoCollectionId,
      );
    }

    return levelThreeLevelTwoCollections[0];
  };

  const getCurrentLevelThreeLevelTwoCollectionForLevelThreeCourse = (currentLevelThreeCollection) => {
    const { levelThreeCollectionProgress, levelThreeCollection: { levelThreeLevelTwoCollections } } = currentLevelThreeCollection;
    return getCurrentLevelThreeLevelTwoCollection(levelThreeCollectionProgress, levelThreeLevelTwoCollections);
  };

  const changeStatusIfOpenLevelOneCollectionProgresses = (levelTwoCollectionProgress) => {
    if (isEmpty(levelTwoCollectionProgress)) return [];

    const levelOneCollectionProgresses = [...levelTwoCollectionProgress.levelOneCollectionProgresses];
    if (isEmpty(levelOneCollectionProgresses)) return [];

    const openProgressStatusElement = levelOneCollectionProgresses.find((progress) => progress.status === 'open');

    if (isEmpty(openProgressStatusElement)) return levelOneCollectionProgresses;

    return levelOneCollectionProgresses.map((levelOneCollectionProgress) => {
      if (levelOneCollectionProgress.status === 'open') {
        return { ...levelOneCollectionProgress, status: 'inProgress' };
      }

      return levelOneCollectionProgress;
    });
  };

  const changeStatusIfContainOpenStatusForLevelTwoCollection = (levelCollections) => {
    if (isEmpty(levelCollections)) return levelCollections;

    return levelCollections.map((levelCollection) => {
      const { levelTwoCollectionProgress } = levelCollection;

      if (isEmpty(levelTwoCollectionProgress)) return levelCollection;

      let { status } = levelTwoCollectionProgress;

      if (status === 'open') status = 'inProgress';

      // const hasOpenStatus = levelCollection.levelTwoCollectionProgress && levelCollection.levelTwoCollectionProgress.status === 'open';
      // if (!hasOpenStatus) {
      //   return levelCollection;
      // }
      return {
        ...levelCollection,
        levelTwoCollectionProgress: {
          ...levelCollection.levelTwoCollectionProgress,
          status,
          levelOneCollectionProgresses: changeStatusIfOpenLevelOneCollectionProgresses(levelCollection.levelTwoCollectionProgress),
        },
      };
    });
  };

  const changeLevelTwoCollectionProgressesStatus = (levelTwoCollectionProgresses) => {
    if (isEmpty(levelTwoCollectionProgresses)) return levelTwoCollectionProgresses;

    return levelTwoCollectionProgresses.map((levelTwoCollectionProgress) => {
      let { status } = levelTwoCollectionProgress;
      if (status === 'open') {
        status = 'inProgress';
      }

      return {
        ...levelTwoCollectionProgress,
        status,
        levelOneCollectionProgresses: changeStatusIfOpenLevelOneCollectionProgresses(levelTwoCollectionProgress),
      };
    });
  };


  const changeStatusIfContainOpenStatusForLevelThreeCollection = (levelCollections) => {
    if (isEmpty(levelCollections)) return levelCollections;

    return levelCollections.map((levelCollection) => {
      const { levelThreeCollectionProgress } = levelCollection;

      if (isEmpty(levelThreeCollectionProgress)) return levelCollection;

      let { status } = levelCollection.levelThreeCollectionProgress;

      if (status === 'open') status = 'inProgress';

      return {
        ...levelCollection,
        levelThreeCollectionProgress: {
          ...levelCollection.levelThreeCollectionProgress,
          status,
          levelTwoCollectionProgresses: changeLevelTwoCollectionProgressesStatus(levelCollection.levelThreeCollectionProgress.levelTwoCollectionProgresses),
        },
      };
    });
  };

  const courseTypeName = levelCourse.__typename;
  let currentLevelCollection;
  let coreCollection;
  let enrichmentCollection;
  const currentLevelCollections = [];
  switch (courseTypeName) {
    case 'LevelThreeCourse':
      coreCollection = changeStatusIfContainOpenStatusForLevelThreeCollection(levelCourse.coreLevelThreeCollectionCourses);
      enrichmentCollection = changeStatusIfContainOpenStatusForLevelThreeCollection(levelCourse.enrichmentLevelThreeCollectionCourses);

      currentLevelCollection = getCurrentLevelThreeCollection(coreCollection);
      currentLevelCollection = currentLevelCollection || getCurrentLevelThreeCollection(enrichmentCollection);
      currentLevelCollection = currentLevelCollection || getLastOrFirstLevelCollection(coreCollection, enrichmentCollection, 'levelThreeCollectionProgress');
      currentLevelCollections[0] = currentLevelCollection.id;
      currentLevelCollections[1] = getCurrentLevelThreeLevelTwoCollectionForLevelThreeCourse(currentLevelCollection).id;
      break;
    case 'LevelTwoCourse':
      coreCollection = changeStatusIfContainOpenStatusForLevelTwoCollection(levelCourse.coreLevelTwoCollectionCourses);
      enrichmentCollection = changeStatusIfContainOpenStatusForLevelTwoCollection(levelCourse.enrichmentLevelTwoCollectionCourses);

      currentLevelCollection = getCurrentLevelTwoCollection(coreCollection);
      currentLevelCollection = currentLevelCollection || getCurrentLevelTwoCollection(enrichmentCollection);
      currentLevelCollection = currentLevelCollection || getLastOrFirstLevelCollection(coreCollection, enrichmentCollection, 'levelTwoCollectionProgress');

      currentLevelCollections[0] = currentLevelCollection.id;
      break;
    default:
      coreCollection = changeStatusIfContainOpenStatusForLevelTwoCollection(levelCourse.coreLevelTwoCollectionCourses);
      enrichmentCollection = changeStatusIfContainOpenStatusForLevelTwoCollection(levelCourse.enrichmentLevelTwoCollectionCourses);

      currentLevelCollection = getCurrentLevelTwoCollection(coreCollection);
      currentLevelCollection = currentLevelCollection || getCurrentLevelTwoCollection(enrichmentCollection);
      currentLevelCollection = currentLevelCollection || getLastOrFirstLevelCollection(coreCollection, enrichmentCollection, 'levelTwoCollectionProgress');

      currentLevelCollections[0] = currentLevelCollection.id;
  }

  if (isEmpty(activeKeys)) {
    setActiveKeys(currentLevelCollections);
  }

  return (
    <Container className="p-0">
      <Row className="mx-0">
        <Col sm={12} className={classNames(styles['bg-white'], styles['content-container'], 'p-0')}>

          <LeaderMessageContainer actionPlanTasks={data.actionPlanTasks} isCourseSyllabusSideView={isCourseSyllabusSideView} />

          {(!isEmpty(coreCollection) ? (
            <SyllabusCollapsePanel
              courseTypeName={courseTypeName}
              courseCollection={coreCollection}
              currentLevelCollections={currentLevelCollections}
              courseId={courseId}
              courseType={<FormattedMessage id="heading.course_index.learn" />}
              activeKeys={activeKeys}
              setActiveKeys={setActiveKeys}
              jumpBackIn={jumpBackIn}
              canShowJumpBackIn={showSyllabusHeading}
              isCourseSyllabusSideView={isCourseSyllabusSideView}
            />
          ) : null)}
          {(!isEmpty(enrichmentCollection) ? (
            <SyllabusCollapsePanel
              courseTypeName={courseTypeName}
              courseCollection={enrichmentCollection}
              currentLevelCollections={currentLevelCollections}
              courseId={courseId}
              courseType={<FormattedMessage id="heading.course_index.reinforce" />}
              activeKeys={activeKeys}
              setActiveKeys={setActiveKeys}
              jumpBackIn={jumpBackIn}
              canShowJumpBackIn={showSyllabusHeading}
              isCourseSyllabusSideView={isCourseSyllabusSideView}
            />
          ) : null)}
        </Col>
      </Row>
    </Container>
  );
};

CourseSyllabusDockedView.defaultProps = {
  showSyllabusHeading: true,
  courseId: null,
  isCourseSyllabusSideView: false,
};

CourseSyllabusDockedView.propTypes = {
  showSyllabusHeading: PropTypes.bool,
  courseId: PropTypes.string,
  isCourseSyllabusSideView: PropTypes.bool,
};

export default CourseSyllabusDockedView;
