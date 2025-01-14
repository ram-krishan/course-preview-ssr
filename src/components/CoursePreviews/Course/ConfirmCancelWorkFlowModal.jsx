import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const ConfirmCancelWorkFlowModal = ({ showConfirmCancelModal, closeConfirmCancelModal, handleCancelCourseWorkFlow }) => {
 
  return <Modal show={showConfirmCancelModal} onHide={closeConfirmCancelModal}>
    <Modal.Header closeButton>
      <FormattedMessage id="coursePreview.cancelWorkflowStage.confirmationModal.heading" />
    </Modal.Header>
    <Modal.Body>
      <FormattedMessage id="coursePreview.cancelWorkflowStage.confirmationModal.message" />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={closeConfirmCancelModal}>
        <FormattedMessage id="coursePreview.setWorkflowStage.btn.cancel" />
      </Button>
      <Button color="primary" onClick={handleCancelCourseWorkFlow}>
        <FormattedMessage id="coursePreview.setWorkflowStage.btn.ok" />
      </Button>
    </Modal.Footer>
  </Modal>;
};

export default ConfirmCancelWorkFlowModal;
