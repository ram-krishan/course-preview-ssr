import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import './course-hierarchy-v2-style.scss';

const ValidateDataErrorModal = ({showModal, setShowModal, courseValidationRecord}) => {

  if(isEmpty(courseValidationRecord)) {
    return null;
  }

  return <Modal dialogClassName="modal-90h" size="xl" show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
      <p>Validation Details</p>
    </Modal.Header>
    <Modal.Body className="word-break-errors modal-body-height-700px">
    <pre>{JSON.stringify(courseValidationRecord, null, 2)}</pre>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={() => setShowModal(false)}>
        <FormattedMessage id="coursePreview.setWorkflowStage.btn.cancel" />
      </Button>
    </Modal.Footer>
  </Modal>;
};

export default ValidateDataErrorModal;

