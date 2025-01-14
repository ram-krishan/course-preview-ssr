/* eslint-disable react/jsx-indent-props */
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';

import styles from './senior-leader-message-page.module.scss';
import SeniorLeaderMessageComponent from './SeniorLeaderMessageComponent';

const SeniorLeaderMessagePreview = () =>{
  const {
    senior_leader_message_cms_id: seniorLeaderMessageCmsId,
    courseCmsId,
    courseType,
    locale,
  } = useParams();

  return (
    <Container fluid className={classNames(styles['senior-leader-message-container'], 'p-0')}>
      <Row className="mx-0 min-height-75vh">
        <Col sm={12} className="p-0 content-container">
          <SeniorLeaderMessageComponent
            seniorLeaderMessageCmsId={seniorLeaderMessageCmsId}
            courseId={courseCmsId}
            locale={locale}
            courseType={courseType}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SeniorLeaderMessagePreview;
