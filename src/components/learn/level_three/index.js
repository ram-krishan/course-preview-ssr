import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import LearnComponent from './LearnComponent';
import '../../assets/css/common-style.css';
import styles from '../learn-page.module.scss';
import ProductExperienceSurvey from '../../lesson/product_experience';

const Learn = () => {
  const {
    vib_level_three_collection_course_id: lvl3CollectionCourseId,
    vib_level_three_level_two_collection_id: lvl3Lvl2CollectionId,
  } = useParams();

  return (
    <>
      <Container data-testid="level-three-course-container" className="px-0">
        <Row className="mx-0 min-height-75vh">
          <Col lg={12} className={`${styles['learn-panel']} content-container px-0`}>
            <ProductExperienceSurvey />
            <LearnComponent
              lvl3CollectionCourseId={lvl3CollectionCourseId}
              lvl3Lvl2CollectionId={lvl3Lvl2CollectionId}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Learn;
