import React from 'react';
import {
  Accordion,
  Card,
} from 'react-bootstrap';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './course-syllabus-docked-view-style.module.scss';
import { getItemClassName } from '../../shared/ProgressUtility';
import InnerAccordion from './InnerAccordion';
import InnerAccordionEnd from './InnerAccordionEnd';
import SyllabusCollapseOuterHeading from './SyllabusCollapseOuterHeading';
import SyllabusCollapseInnerHeading from './SyllabusCollapseInnerHeading';
import { getLevelTwoCollectionExamData } from './util';
import useSuperScript from '../../shared/hooks/useSuperScript';

const OuterAccordion = ({
  object,
  courseKeys,
  courseKeyIndex,
  courseId,
  outerIndex,
  activeId,
  setActiveId,
  jumpBackIn,
  currentLevelCollections,
  activeKeys,
  setActiveKeys,
  canShowJumpBackIn,
  isCourseSyllabusSideView,
}) => {
  useSuperScript();

  const toggleActive = (id, activeIndex) => {
    const keys = [...activeKeys];
    if (activeKeys[activeIndex] === id) {
      keys[activeIndex] = '';
    } else {
      keys[activeIndex] = id;
    }
    setActiveKeys(keys);
  };

  const toggleActiveKey = (id) => {
    const keys = [...activeKeys];
    const { length } = keys;
    if (activeKeys[courseKeyIndex] === id) {
      keys[courseKeyIndex] = '';
    } else {
      keys[courseKeyIndex] = id;
    }
    if (length === 3) {
      keys[courseKeyIndex + 1] = '';
      keys[courseKeyIndex + 2] = '';
    } else if (length === 2) {
      keys[courseKeyIndex + 1] = '';
    }
    setActiveKeys(keys);
  };

  const getLevelOneCollectionData = (arr, statusKey, levelOneCollectionProgress) => {
    const levelOneObj = get(arr, statusKey);
    const levelOneProgress = levelOneCollectionProgress.find((progress) => progress.levelOneCollectionCmsId === levelOneObj.cmsId);

    const levelOneProgressStatus = levelOneProgress ? levelOneProgress.status : 'open';

    return {
      status: levelOneProgressStatus,
      levelOneCollection: {
        ...levelOneObj,
        lessonPageUrl: levelOneProgress && levelOneProgress.lessonPageUrl,
      },
    };
  };

  function getLevelTwoLevelOneCollectionProgress(
    levelTwoLevelOneCollections, levelOneCollectionProgress, statusKey,
  ) {
    return levelTwoLevelOneCollections.map(
      (arr) => getLevelOneCollectionData(arr, statusKey, levelOneCollectionProgress),
    );
  }

  function getLevelTwoCollection(object, idKey, titleKey, statusKey, levelTwoLevelOneCollectionskey, levelOneCollectionProgressKey, descriptionKey, typenameKey, levelTwoLearnPageUrl) {
    const levelTwoCollectionObject = {
      id: get(object, idKey),
      title: get(object, titleKey),
      status: get(object, statusKey) || 'open',
      description: get(object, descriptionKey),
      levelTwoLearnPageUrl: get(object, levelTwoLearnPageUrl),
      levelTwoLevelOneCollections:
        object.levelTwoCollectionProgress
          ? getLevelTwoLevelOneCollectionProgress(
            object.levelTwoCollection.levelTwoLevelOneCollections,
            object.levelTwoCollectionProgress.levelOneCollectionProgresses,
            'levelOneCollection',
          ) : object.levelTwoCollection.levelTwoLevelOneCollections,
      __typename: get(object, typenameKey),
    };

    const examHash = getLevelTwoCollectionExamData(
      object.levelTwoCollection, object.levelTwoCollectionProgress,
    );

    return { ...levelTwoCollectionObject, ...examHash };
  }

  if (object.__typename === 'LevelTwoCollectionCourse') {
    return (
      <InnerAccordion
        object={getLevelTwoCollection(object, 'id', 'levelTwoCollection.title', 'levelTwoCollectionProgress.status', 'levelTwoLevelOneCollections.levelTwoLevelOneCollections.levelOneCollection', 'levelTwoCollectionProgress.levelOneCollectionProgresses.status', 'levelTwoCollection.description', 'levelTwoCollection.__typename', 'levelTwoCollectionProgress.levelTwoLearnPageUrl')}
        courseKeys={['levelTwoCollection', 'levelTwoLevelOneCollections']}
        courseKeyIndex={courseKeyIndex}
        courseId={courseId}
        index={outerIndex}
        activeId={activeId}
        setActiveId={setActiveId}
        jumpBackIn={jumpBackIn}
      />
    );
  }
  return (
    <Accordion data-testid="outer-accordion" activeKey={activeKeys[courseKeyIndex]}>
      {object[courseKeys[courseKeyIndex]].map((item, index) => (
        <Card
          key={item.id}
          className={classNames(
            activeKeys[courseKeyIndex] === item.id ? `${styles['topic-collapse-open']}` : '',
            courseKeyIndex !== 0 ? 'border-0 bg-transparent' : `${styles['topics-card']}`,
            item.type !== 'LevelTwoCollection' && courseKeyIndex === 1 ? styles['inner-topics-card'] : '',
          )}
        >
          <Accordion.Toggle
            as={Card.Header}
            onClick={() => toggleActiveKey(item.id, courseKeyIndex)}
            eventKey={item.id}
            className={classNames(`d-flex align-items-center accordion
              ${styles['topics-card-header']} ${styles[getItemClassName(item)]}`,
            activeKeys[courseKeyIndex] === item.id ? `${styles['collapse-open']}` : `${styles['collapse-close']}`,
            courseKeyIndex !== 0 ? `${styles['inner-topics-card-header']}` : '', courseKeyIndex === 0 ? `${styles['outer-accordion']}` : '', isCourseSyllabusSideView ? styles['topics-docked-view'] : '')}
          >
            {courseKeyIndex === 0 ? (
              <SyllabusCollapseOuterHeading
                item={item}
                isOpen={activeKeys[courseKeyIndex] === item.id}
                index={index}
              />
            ) : (
              <SyllabusCollapseInnerHeading
                item={item}
              />
            )}
          </Accordion.Toggle>
          <Accordion.Collapse
            eventKey={item.id}
            key={item.id}
          >
            <Card.Body className={styles['customize-card-body']}>
              {
                (courseKeys[courseKeyIndex + 1] === courseKeys[courseKeys.length - 2]) ? (
                  <InnerAccordionEnd
                    object={item}
                    courseKeys={courseKeys}
                    courseKeyIndex={courseKeyIndex + 1}
                    activeKeys={activeKeys}
                    toggleActive={toggleActive}
                  />
                ) : (
                  <OuterAccordion
                    object={item}
                    courseKeys={courseKeys}
                    currentLevelCollections={currentLevelCollections}
                    courseKeyIndex={courseKeyIndex + 1}
                    currentTopicId={null}
                    courseId={courseId}
                    activeKeys={activeKeys}
                    setActiveKeys={setActiveKeys}
                    jumpBackIn={jumpBackIn}
                    canShowJumpBackIn={canShowJumpBackIn}
                    isCourseSyllabusSideView={isCourseSyllabusSideView}
                    outerIndex={index}
                  />
                )
              }
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
};

OuterAccordion.defaultProps = {
  setActiveKeys: () => {},
  activeKeys: [],
  currentLevelCollections: [],
  isCourseSyllabusSideView: false,
  setActiveId: () => {},
  activeId: '',
};

OuterAccordion.propTypes = {
  object: PropTypes.shape({
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
    __typename: PropTypes.string,
  }).isRequired,
  courseId: PropTypes.string.isRequired,
  currentLevelCollections: PropTypes.arrayOf(PropTypes.string),
  activeKeys: PropTypes.arrayOf(PropTypes.string),
  setActiveKeys: PropTypes.func,
  jumpBackIn: PropTypes.shape({
    courseId: PropTypes.string,
    courseTitle: PropTypes.string,
    jumpBackInPath: PropTypes.string,
    jumpBackInDesc: PropTypes.string,
  }).isRequired,
  courseKeys: PropTypes.oneOfType([
    PropTypes.array,
  ]).isRequired,
  courseKeyIndex: PropTypes.number.isRequired,
  activeId: PropTypes.string,
  setActiveId: PropTypes.func,
  isCourseSyllabusSideView: PropTypes.bool,
};
export default OuterAccordion;
