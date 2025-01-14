import React from 'react';
import { useParams } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';
import LearnComponent from './LearnComponent';

import styles from './learn-page.module.scss';
import '../assets/css/common-style.css';
// import Breadcrumb from '../shared/breadcrumbs';
// import { CurrentUserConsumer } from '../../../currentUserContext';
import ProductExperienceSurvey from '../lesson/product_experience';

const Learn = () => {
  const {
    vib_course_id: courseId,
    vib_level_two_collection_course_id: levelTwoCollectionCourseId,
    locale,
  } = useParams();
  return (
    <>
      <Container className="px-0">
        <Row className="mx-0 min-height-75vh mt-2">
          <Col lg={12} className={`${styles['learn-panel']} content-container px-0`}>
            <ProductExperienceSurvey />
            <LearnComponent
              courseId={courseId}
              levelTwoCollectionCourseId={levelTwoCollectionCourseId}
              locale={locale}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Learn;
