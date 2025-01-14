import React from 'react';
import {
  Row,
  Col,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CollapseContainer from './CollapseContainer';
import styles from './course-syllabus-docked-view-style.module.scss';

const SyllabusCollapsePanel = ({
  canShowJumpBackIn,
  courseTypeName,
  courseCollection,
  currentLevelCollections,
  courseId,
  activeKeys,
  setActiveKeys,
  courseType,
  jumpBackIn,
  isCourseSyllabusSideView,
}) => (
  <Row className="pt-3 pb-4">
    <Col lg={12} className="pl-3">
      <h5 className={classNames(styles['topic-top-heading'], isCourseSyllabusSideView ? styles['topic-top-small-heading'] : '')}>
        {courseType}
      </h5>
      <CollapseContainer
        courseTypeName={courseTypeName}
        courseCollection={courseCollection}
        currentLevelCollections={currentLevelCollections}
        courseId={courseId}
        jumpBackIn={jumpBackIn}
        activeKeys={activeKeys}
        setActiveKeys={setActiveKeys}
        canShowJumpBackIn={canShowJumpBackIn}
        isCourseSyllabusSideView={isCourseSyllabusSideView}
      />
    </Col>
  </Row>
);

SyllabusCollapsePanel.defaultProps = {
  isCourseSyllabusSideView: false,
};

SyllabusCollapsePanel.propTypes = {
  courseTypeName: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  currentLevelCollections: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  activeKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  setActiveKeys: PropTypes.func.isRequired,
  courseType: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  jumpBackIn: PropTypes.shape({
    courseId: PropTypes.string,
    courseTitle: PropTypes.string,
    jumpBackInPath: PropTypes.string,
    jumpBackInDesc: PropTypes.string,
  }).isRequired,
  isCourseSyllabusSideView: PropTypes.bool,
};
export default SyllabusCollapsePanel;
