// "FILE NOT IN USED"
import React from 'react';
import { Col } from 'react-bootstrap';
import classNames from 'classnames';

import styles from './learn-page.module.scss';

const CourseCard = ({course}) => {
  return (
    <Col lg={3}>
      <img className={styles['course-small-img']} src={course.imgPath} alt="recommended-img" />
      <h6 className={styles['course-heading']}>{course.heading}</h6>
      <div className={classNames(styles['course-card-desc'], 'color-light small_fontsize')}>
        <div className={styles['course-title']}>{course.title}</div>
        <div className={styles['estimated-time']}>{course.estimatedTime}</div>
      </div>
    </Col>
  );
};

export default CourseCard;
