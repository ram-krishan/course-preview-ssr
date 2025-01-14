import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ToolBlock from './ToolBlock';
import styles from './apply-page.module.scss';
import useSuperScript from '../../shared/hooks/useSuperScript';

const CourseLearningResources = ({ learningResourcesCourse }) => {
  useSuperScript();
  const [learningResources, setLearningResources] = useState([]);

  useEffect(() => {
    setLearningResources(learningResourcesCourse.courseLearningResources);
  }, []);  

  return (
    <>
      <h5 className={classNames(styles['sub-heading'], 'mb-2 mt-5')}>{learningResourcesCourse.title}</h5>
      <span className={classNames(styles['course-title-bar'])} />
      <div id="scrollableDiv" className={classNames(styles[learningResources.length <= 8 ? 'scroller-false' : 'scroller-true'])}>
        <Row className="mx-0 mb-5">
          <ToolBlock
            courseLearningResources={learningResources}
            courseId={learningResourcesCourse.id}
          />
        </Row>
      </div>
    </>
  );
};

CourseLearningResources.propTypes = {
  learningResourcesCourse: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    pageInfo: PropTypes.shape({
      endCursor: PropTypes.string.isRequired,
      hasNextPage: PropTypes.bool.isRequired,
    }),
  }).isRequired,
  perPage: PropTypes.number.isRequired,
};
export default CourseLearningResources;
