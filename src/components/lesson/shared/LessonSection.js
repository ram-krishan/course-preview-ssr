import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Container, Row, Col } from 'react-bootstrap';
import styles from '../lesson-page.module.scss';
import '../../assets/css/common-style.css';

const LessonSection = ({ children }) => (
  <Container className="px-0">
    <Row className="mx-0 min-height-75vh">
      <Col lg={12} className={classNames(styles['lesson-panel'], 'px-0 content-container')}>
        {children}
      </Col>
    </Row>
  </Container>
);

LessonSection.propTypes = {
  children: PropTypes.node.isRequired,
};
export default LessonSection;
