import React from 'react';
import classNames from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import LessonPage from './LessonPage';
import styles from './lesson-page.module.scss';
import '../assets/css/common-style.css';
import ProductExperienceSurvey from './product_experience';

const Lesson = () => {
  const { vib_course_id: courseId, level_two_level_one_collection_id: vibLevelTwoLevelOneCollectionId, level_two_collection_progress_id: levelTwoCollectionProgressId } = useParams();
  return (
    <>
      {/* <Breadcrumb
        containerClass="bg-transparent"
        breadcrumbItems={data}
      /> */}
      <Container data-testid="lesson-content-container" className="px-0">
        <Row className="mx-0">
          <Col lg={12} className={classNames(styles['lesson-panel'], 'px-0 content-container')}>
            <ProductExperienceSurvey topicLessonId={vibLevelTwoLevelOneCollectionId} />
            <LessonPage
              courseId={courseId}
              vibLevelTwoLevelOneCollectionId={vibLevelTwoLevelOneCollectionId}
              levelTwoCollectionProgressId={levelTwoCollectionProgressId}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Lesson;
