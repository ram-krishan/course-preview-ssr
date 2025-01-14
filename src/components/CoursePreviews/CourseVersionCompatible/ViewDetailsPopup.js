import React from 'react';

import { Modal, Row, Col } from 'react-bootstrap';

const ViewDetailsPopup = ({
  viewDetails = false,
  closeModal = () => {},
  courseData
}) => {
  return(
    <Modal show={viewDetails} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Row>
          <Col><h1 id="viewDetailsPopup.heading"/></Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        <pre>{ JSON.stringify(courseData, null, 2) }</pre>
      </Modal.Body>
    </Modal>
  )
};

export default ViewDetailsPopup;