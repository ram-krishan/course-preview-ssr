import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import Select from 'react-select';
import Loader from '../../../shared/Loader';
import useGetWorkFlowStages from '../hooks/useGetWorkFlowStages';
import useSubmitSelectWorkflowStage from '../hooks/useSubmitSelectWorkflowStage';

const WorkFlowModal = ({ showModal, setErrorMessage, setShowModal, selectedCourse, handleClose, setRefetchWorkFlowStatus }) => {
  const initialSelectedWorkFlowState = {
    content_type_uid: selectedCourse.typename
    , entry_cms_uid: selectedCourse.value
    , workflow_stage_uid: ''
  }

  const [loading, setLoading] = useState(false)
  const [selectWorkflowStage, setSelectWorkflowStage] = useState(initialSelectedWorkFlowState);

  const { loading: getWorkFlowStagesLoading, stages, error: getWorkFlowStagesError } = useGetWorkFlowStages(initialSelectedWorkFlowState, showModal)
  const { submitSelectWorkflowStage } = useSubmitSelectWorkflowStage();

  const renderOptions = (collection) => (
    collection && collection.map((obj) => ({
      value: obj.uid,
      label: obj.name,
    }))
  )

  useEffect(() => {
    // Setting up reset states when we re-open the modal pop
    if (showModal) {
      setErrorMessage('');
      setSelectWorkflowStage(initialSelectedWorkFlowState);
    }
  }, [showModal])

  const handleChange = (args) => {
    setSelectWorkflowStage({ ...selectWorkflowStage, workflow_stage_uid: args.value })
  };

  const handleSubmitSelectWorkflowStage = async (args) => {
    submitSelectWorkflowStage({ setLoading, setErrorMessage, setShowModal, args, setRefetchWorkFlowStatus })
  }

  return <Modal show={showModal} onHide={handleClose}>
    <Modal.Header closeButton>
      <h1 id="coursePreview.setWorkflowStage.heading" />
    </Modal.Header>
    {
      getWorkFlowStagesLoading ? < Loader /> : getWorkFlowStagesError ? null : <>
        <Modal.Body>
          {loading ? <Loader /> : null}
          <h1 id='coursePreview.setWorkflowStage.body' />
          <Select
            options={renderOptions(stages)}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>
            <h1 id="coursePreview.setWorkflowStage.btn.cancel" />
          </Button>
          <Button color="primary" onClick={() => handleSubmitSelectWorkflowStage(selectWorkflowStage)} disabled={loading || selectWorkflowStage.workflow_stage_uid === '' }>
            <h1 id="coursePreview.setWorkflowStage.btn.ok" />
          </Button>
        </Modal.Footer>
      </>
    }
  </Modal>;
};

export default WorkFlowModal;
