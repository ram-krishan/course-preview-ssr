import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';

import Loader from '../../shared/Loader';
import useVersionCompatibleDetails from './hooks/useVersionCompatibleDetails';

const ViewResultPopup = ({
  viewResult = false,
  closeModal = () => { },
  versionLog,
  courseCmdId
}) => {

  const { data,
    errorMessages,
    loading } = useVersionCompatibleDetails({versionCompatibilityLogId: versionLog && versionLog.id, courseCmdId, viewResult})
  return (
    <Modal show={viewResult} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Row>
          <Col><h1 id="viewResultPopup.heading" /></Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        { loading ? <Loader /> :
        <pre>{JSON.stringify(data && data.record, null, 2)}</pre>}
      </Modal.Body>
    </Modal>
  )
};

export default ViewResultPopup;