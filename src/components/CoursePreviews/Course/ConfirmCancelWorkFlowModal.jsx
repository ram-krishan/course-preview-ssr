import React from 'react';
import { Button, Modal } from 'react-bootstrap';


const ConfirmCancelWorkFlowModal = ({ showConfirmCancelModal, closeConfirmCancelModal, handleCancelCourseWorkFlow }) => {

  return <Modal show={showConfirmCancelModal} onHide={closeConfirmCancelModal}>
    <Modal.Header closeButton>
      <h1 id="coursePreview.cancelWorkflowStage.confirmationModal.heading" />
    </Modal.Header>
    <Modal.Body>
      <h1 id="coursePreview.cancelWorkflowStage.confirmationModal.message" />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={closeConfirmCancelModal}>
        <h1 id="coursePreview.setWorkflowStage.btn.cancel" />
      </Button>
      <Button color="primary" onClick={handleCancelCourseWorkFlow}>
        <h1 id="coursePreview.setWorkflowStage.btn.ok" />
      </Button>
    </Modal.Footer>
  </Modal>;
};

export default ConfirmCancelWorkFlowModal;
