import React from 'react';
import {
  Col,
} from 'react-bootstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import styles from './apply-page.module.scss';
import LearningResourceContentContainer from './LearningResourceContentContainer';

const ToolBlock = ({ courseLearningResources, courseId }) => (
  <>
    {courseLearningResources.map((courseLearningResource, index) => (
      <Col className={classNames(styles['courseCard'], "mt-4")} key={courseLearningResource.id}>
        <div className={classNames(styles['card-view'], index === 0 ? 'px-4 py-3' : 'px-4 py-3')}>
          {!isEmpty(courseLearningResource.imageUrl) ? (<>
            <div className={styles['card-background-img']} style={ { backgroundImage: `url(${courseLearningResource.imageUrl})` } } />
            </>
          ) : null}
          <div className={classNames(styles['card-text-container'])}>
            <LearningResourceContentContainer
              courseLearningResource={courseLearningResource}
              courseId={courseId}
            />
          </div>
        </div>
      </Col>
    ))}
  </>
);

ToolBlock.defaultProps = {
  courseLearningResources: [],
};

ToolBlock.propTypes = {
  courseLearningResources: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.string,
      fileType: PropTypes.string,
      image: PropTypes.string,
      description: PropTypes.string,
      status: PropTypes.string,
    }),
  })),
  courseId: PropTypes.string.isRequired,
};
export default ToolBlock;
