import React from 'react'

const useSubmitSelectWorkflowStage = () => {

  const submitSelectWorkflowStage = async ({setLoading, setRefetchWorkFlowStatus, setErrorMessage, setShowModal, args}) => {
    setLoading(true)
    const config = {
      method: 'POST',
      body: JSON.stringify(args),
      headers: {
        'x-api-key': process.env.REACT_APP_COURSE_WORKFLOW_UPDATE_SERVICE_API_KEY,
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch(process.env.REACT_APP_COURSE_WORKFLOW_STAGES_ENDPOINT, config);
      const res = await response.json()
      if (res.success) {
        setLoading(false)
        setRefetchWorkFlowStatus(true)
        setShowModal(false)
      } else {
        setLoading(false)
        setErrorMessage(res.error_message || "")
        setShowModal(false)
      }
    }
    catch (error) {
      setErrorMessage(error.message)
      console.log(error);
      setShowModal(false)
    }
  }

  return {submitSelectWorkflowStage}
}

export default useSubmitSelectWorkflowStage