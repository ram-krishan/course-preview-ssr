// "FILE NOT IN USED"
import React from 'react';
import { Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import CourseCard from './CourseCard';
import {
  Course1Img,
  Course2Img,
  Course3Img,
  Course4Img,
} from '../shared/vib_images';
import styles from './learn-page.module.scss';

const recommendedCourses = [
  {
    heading: 'blog',
    title: 'How to Coach Your Buyers Through the Purchasing Process',
    estimatedTime: '8 minute read',
    imgPath: Course1Img,
  },
  {
    heading: 'Success Story',
    title: 'How a Customized Sales Process Transformed This Organization',
    estimatedTime: '6 minute read',
    imgPath: Course2Img,
  },
  {
    heading: 'LESSON',
    title: 'Sales Conversation: Exploring Organizational Impact',
    estimatedTime: '6 minute read',
    imgPath: Course3Img,
  },
  {
    heading: 'blog',
    title: 'How to Coach Your Buyers Through the Purchasing Process',
    estimatedTime: '8 minute read',
    imgPath: Course4Img,
  },
];

const RecommendedBlock = () => (
  <div className="mt-5 pb-4">
    <h5 className={styles['recommended-heading']}><strong><FormattedMessage id="heading.recommended" /></strong></h5>
    <Row className="mt-3">
      {recommendedCourses.map((recommendedCourse, index) => (
        <CourseCard
          key={`CourseCard-${index}`}
          course={recommendedCourse}
          srcPath={recommendedCourse.Course1Img}
        />
      ))}
    </Row>
  </div>
);

export default RecommendedBlock;
