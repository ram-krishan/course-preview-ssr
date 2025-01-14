import React, { useState } from 'react';
import {
  Accordion,
  Card,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './course-syllabus-docked-view-style.module.scss';
import SyllabusCollapseInnerHeading from './SyllabusCollapseInnerHeading';
import ListItemComponent from './ListItemComponent';
import { getItemClassName } from '../../shared/ProgressUtility';

const InnerAccordionEnd = ({
  object,
  courseKeys,
  courseKeyIndex,
  activeKeys,
  toggleActive,
}) => {
  const dynamicProps = {};
  if (activeKeys[courseKeyIndex]) {
    dynamicProps.defaultActiveKey = activeKeys[courseKeyIndex];
  }

  const item = {
    status: 'open',
  };
  const getStatus = (objData) => (objData.status ? objData : item);

  return (
    <Accordion activeKey={activeKeys[courseKeyIndex]}>
      {object[courseKeys[courseKeyIndex]].map((item, index) => (
        <Card
          key={item.id}
          className={classNames(styles['topics-card'], activeKeys[courseKeyIndex] === item.id ? `${styles['topic-collapse-open']}` : '')}
        >
          <Accordion.Toggle
            as={Card.Header}
            onClick={() => toggleActive(item.id, courseKeyIndex)}
            eventKey={item.id}
            className={classNames(`d-flex align-items-center accordion ${styles['topics-card-header']} ${item.status === 'inProgress' ? styles[getItemClassName(getStatus(object))] : ''}`, activeKeys[courseKeyIndex] === item.id ? `${styles['collapse-open']}` : `${styles['collapse-close']}`, object.__typename !== 'LevelTwoCollection' ? styles['inner-topics-card-header'] : '')}
          >
            <SyllabusCollapseInnerHeading
              item={item}
            />
          </Accordion.Toggle>
          <Accordion.Collapse
            eventKey={item.id}
            key={item.id}
          >
            <Card.Body className={styles['customize-card-body']}>
              <ul className={`pl-2 pb-3 list-unstyled ${classNames(styles['lessons-list'])}`}>
                {
                  item[courseKeys[courseKeyIndex + 1]].map((innerItem, index) => (
                    <ListItemComponent
                      key={innerItem.id}
                      targetObject={innerItem}
                      wrapperObject={item}
                      targetTitleUrl={innerItem.lessonPageUrl}
                      listIndex={index}
                      showLinkOnTitle
                    />
                  ))
                }
                {
                  item.exam
                    ? (
                      <ListItemComponent
                        targetObject={item.exam}
                        wrapperObject={item}
                        targetTitleUrl={item.exam.examUrl}
                        showLinkOnTitle
                        listIndex={item[courseKeys[courseKeyIndex + 1]].length}
                      />
                    )
                    : null
                }
              </ul>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
};

InnerAccordionEnd.defaultProps = {
  activeKeys: [],
};

InnerAccordionEnd.propTypes = {
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
  activeKeys: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  courseKeys: PropTypes.oneOfType([
    PropTypes.array,
  ]).isRequired,
  courseKeyIndex: PropTypes.number.isRequired,
  toggleActive: PropTypes.func.isRequired,
};

export default InnerAccordionEnd;
