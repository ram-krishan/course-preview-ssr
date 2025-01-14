import React from 'react';
import {
  Accordion,
  Card,
} from 'react-bootstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import styles from './course-syllabus-docked-view-style.module.scss';
import { getItemClassName } from '../../shared/ProgressUtility';
import SyllabusCollapseInnerHeading from './SyllabusCollapseInnerHeading';
import SyllabusCollapseOuterHeading from './SyllabusCollapseOuterHeading';
import ListItemComponent from './ListItemComponent';

const InnerAccordion = ({
  object,
  index,
  activeId,
  setActiveId,
}) => {
  const toggleActive = (id) => {
    if (activeId === id) {
      setActiveId(null);
    } else {
      setActiveId(id);
    }
  };

  function getLevelTwoLevelOneCollections(array, idKey, titleKey, statusKey, lessonPageUrlKey, typename) {
    return array.map((arr) => ({
      id: get(arr, idKey),
      title: get(arr, titleKey),
      status: get(arr, statusKey) || 'open',
      lessonPageUrl: get(arr, lessonPageUrlKey),
      __typename: get(arr, typename),
    }));
  }

  const item = {
    status: 'open',
  };
  const getStatus = (objData) => (objData.status ? objData : item);
  return (
    <>
      {object ? (
        <Card
          data-testid="inner-accordion"
          key={object.id}
          className={classNames(styles['topics-card'], activeId === object.id ? `${styles['topic-collapse-open']}` : '')}
        >
          <Accordion.Toggle
            as={Card.Header}
            onClick={() => toggleActive(object.id)}
            eventKey={object.id}
            className={classNames(`d-flex align-items-center accordion ${styles['topics-card-header']} ${styles[getItemClassName(getStatus(object))]}`, activeId === object.id ? `${styles['collapse-open']}` : `${styles['collapse-close']}`, object.__typename !== 'LevelTwoCollection' ? styles['inner-topics-card-header'] : '', styles['topics-docked-view'])}
          >
            {object.__typename === 'LevelTwoCollection' ? (
              <SyllabusCollapseOuterHeading
                item={object}
                index={index}
                isOpen={activeId === object.id}
              />
            ) : (
              <SyllabusCollapseInnerHeading item={object} />
            )}
          </Accordion.Toggle>
          <Accordion.Collapse
            eventKey={object.id}
            key={object.id}
            className={styles['inner-collapse']}
          >
            <Card.Body className={styles['customize-card-body']}>
              <ul className={`pl-2 list-unstyled pb-3 pt-3 ${classNames(styles['lessons-list'])}`}>
                {
                  getLevelTwoLevelOneCollections(
                    object.levelTwoLevelOneCollections, 'levelOneCollection.id', 'levelOneCollection.title', 'status', 'levelOneCollection.lessonPageUrl', 'levelOneCollection.__typename',
                  ).map((innerItem, index) => (
                    <ListItemComponent
                      key={innerItem.id}
                      targetObject={innerItem}
                      targetTitleUrl={innerItem.lessonPageUrl}
                      listIndex={index}
                      showLinkOnTitle
                      isLevelTwoCollectionCourse
                    />
                  ))
                }
                {
                  object.exam
                    ? (
                      <ListItemComponent
                        targetObject={object.exam}
                        targetTitleUrl={object.exam.examUrl}
                        showLinkOnTitle
                        listIndex={object.levelTwoLevelOneCollections.length}
                        isLevelTwoCollectionCourse
                      />
                    )
                    : null
                }

              </ul>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ) : null}
    </>
  );
};

InnerAccordion.propTypes = {
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
  index: PropTypes.number.isRequired,
  activeId: PropTypes.string.isRequired,
  setActiveId: PropTypes.func.isRequired,
};

export default InnerAccordion;
