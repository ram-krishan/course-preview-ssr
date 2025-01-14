import React, { useState } from 'react';
import {
  Accordion,
} from 'react-bootstrap';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styles from './course-syllabus-docked-view-style.module.scss';
import OuterAccordion from './OuterAccordion';
import { getLevelTwoCollectionExamData } from './util';

const CollapseContainer = ({
  activeKeys,
  setActiveKeys,
  courseTypeName,
  courseCollection,
  currentLevelCollections,
  courseId,
  jumpBackIn,
  canShowJumpBackIn,
}) => {
  const [activeId, setActiveId] = useState(activeKeys[0]);
  let courseKeys = [];
  const progressStatus = (progress) => {
    let status = 'open';
    if (progress) {
      status = progress.status;
    }
    return (status);
  };

  const getCurrentLearnPageUrl = (progress) => {
    if (isEmpty(progress)) {
      return ('');
    }
    return (progress.levelTwoLearnPageUrl);
  };

  const findProgress = (progressCollection, id, key) => {
    let progress = null;
    if (Array.isArray(progressCollection)) {
      progress = progressCollection.find((obj) => obj[key] === id);
    }
    return (progress);
  };

  const nextLevelCollectionProgress = (progress, key) => (
    progress && progress[key]
  );

  const getLevelOneCollection = (levelOneCollections, levelTwoCollectionProgress) => (
    levelOneCollections.map((item, index) => {
      const progress = findProgress(nextLevelCollectionProgress(levelTwoCollectionProgress, 'levelOneCollectionProgresses'), item.cmsId, 'levelOneCollectionCmsId');

      return (
        {
          id: item.id,
          title: item.title,
          indexLabel: `${index + 1}`,
          status: progressStatus(progress),
          description: item.description,
          lessonPageUrl: progress && progress.lessonPageUrl,
          __typename: 'LevelOneCollection',
        }
      );
    })
  );

  const getLevelTwoCollections = (levelThreeLevelTwoCollections, levelThreeCollectionProgress, parentIndex) => (
    levelThreeLevelTwoCollections.map((item, index) => {
      const progress = findProgress(nextLevelCollectionProgress(levelThreeCollectionProgress, 'levelTwoCollectionProgresses'), item.levelTwoCollection.id, 'levelTwoCollectionId');
      const levelTwoCollectionHash = {
        id: item.id,
        title: item.levelTwoCollection.title,
        indexLabel: `${parentIndex}.${index + 1}`,
        status: progressStatus(progress),
        levelTwoLearnPageUrl: getCurrentLearnPageUrl(progress),
        description: item.levelTwoCollection.description,
        levelOneCollections: getLevelOneCollection(item.levelTwoCollection.levelOneCollections, progress),
        __typename: 'LevelTwoCollection',
      };

      const examHash = getLevelTwoCollectionExamData(item.levelTwoCollection, progress);
      return { ...levelTwoCollectionHash, ...examHash };
    })
  );

  const getLevelThreeCollections = () => (
    {
      levelThreeCollections: courseCollection.map((item, index) => (
        {
          id: item.id,
          title: item.levelThreeCollection.title,
          indexLabel: `${index + 1}`,
          status: progressStatus(item.levelThreeCollectionProgress),
          description: item.levelThreeCollection.description,
          levelTwoCollections: getLevelTwoCollections(item.levelThreeCollection.levelThreeLevelTwoCollections, item.levelThreeCollectionProgress, `${index + 1}`),
          __typename: 'LevelThreeCollection',
        }
      )),
    }
  );

  if (courseTypeName === 'LevelThreeCourse') {
    courseKeys = [
      'levelThreeCollections',
      'levelTwoCollections',
      'levelOneCollections',
    ];
    const levelThreeCollectionCourse = getLevelThreeCollections();
    return (
      <OuterAccordion
        object={levelThreeCollectionCourse}
        courseKeys={courseKeys}
        courseKeyIndex={0}
        currentLevelCollections={currentLevelCollections}
        courseId={courseId}
        activeKeys={activeKeys}
        setActiveKeys={setActiveKeys}
        jumpBackIn={jumpBackIn}
        canShowJumpBackIn={canShowJumpBackIn}
      />
    );
  }

  return (
    <Accordion data-testid="accordion" defaultActiveKey={activeId} className={styles['card-wp-container']}>
      {courseCollection.map((item, index) => (
        <OuterAccordion
          key={item.id}
          object={item}
          courseKeys={courseKeys}
          courseKeyIndex={0}
          activeId={activeId}
          courseId={courseId}
          outerIndex={index}
          setActiveId={setActiveId}
          jumpBackIn={jumpBackIn}
          canShowJumpBackIn={canShowJumpBackIn}
        />
      ))}
    </Accordion>
  );
};

CollapseContainer.propTypes = {
  courseTypeName: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  courseCollection: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    levelTwoCollection: PropTypes.shape({
      id: PropTypes.string,
      description: PropTypes.string,
      title: PropTypes.string,
      levelTwoLevelOneCollections: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        levelOneCollection: PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
          description: PropTypes.string,
        }),
      })),
    }),
    levelTwoCollectionProgress: PropTypes.shape({
      id: PropTypes.string,
      levelTwoCollectionId: PropTypes.string,
      status: PropTypes.string,
      __typename: PropTypes.string,
      levelOneCollectionProgresses: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        lessonPageUrl: PropTypes.string,
        levelOneCollectionId: PropTypes.string,
        status: PropTypes.string,
      })),
    }),
  })).isRequired,
  currentLevelCollections: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  setActiveKeys: PropTypes.func.isRequired,
  jumpBackIn: PropTypes.shape({
    courseId: PropTypes.string,
    courseTitle: PropTypes.string,
    jumpBackInPath: PropTypes.string,
    jumpBackInDesc: PropTypes.string,
  }).isRequired,
};

export default CollapseContainer;
