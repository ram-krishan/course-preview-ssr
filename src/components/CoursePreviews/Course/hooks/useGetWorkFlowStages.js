import React, { useEffect, useState } from 'react'

const useGetWorkFlowStages = ({ content_type_uid, entry_cms_uid }, showModal) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workflowStageData, setWorkflowStageData] = useState([]);

  const buildUrl = (postFixUrl) => (
    `${process.env.REACT_APP_CONTENT_STACK_MANAGEMENT_API_ENDPOINT}/v3/${postFixUrl}`
  );

  const convertTypeNameToDownCase = (typeName) => {
    return typeName.replace(/([a-z])([0-9])/g, '$1_$2').replace(/([0-9])([A-Z])/g, '$1_$2').toLowerCase();
  }

  const getDataFromApi = async (url) => {
    const headers = {
      api_key: process.env.REACT_APP_CONTENT_STACK_API_KEY,
      authorization: process.env.REACT_APP_CONTENT_STACK_API_MANAGEMENT_TOKEN
    }
    const response = await fetch(url, { headers })
    return await response.json()
  }

  const findNextWorkFlowStageIds = (currentWorkflowStageId, workflow_stages) => {
    return workflow_stages.find((stage) => currentWorkflowStageId === stage.uid)?.next_available_stages
  }

  const findWorkFlowstages = async (currentWorkflowStageId, workflow_stages) => {
    const availableStages = new Array
    const targetWorkFlowStageIds = findNextWorkFlowStageIds(currentWorkflowStageId, workflow_stages)
    await targetWorkFlowStageIds.map((targetStageId) =>{
      const availableStage = workflow_stages.find(stage => stage.uid === targetStageId)
      if(availableStage) availableStages.push(availableStage)
     })
    return availableStages
  }

  const getworkflowsStages = async () => {
    try {

      setLoading(true);

      // for get current workflow stage or selected workflow stage
      const entryWithWorkFlow = await getDataFromApi(buildUrl(`content_types/${convertTypeNameToDownCase(content_type_uid)}/entries/${entry_cms_uid}?include_workflow=true`))
      console.log(entryWithWorkFlow)
      if(entryWithWorkFlow) {
        let {
          entry: {
            _workflow: { uid: currentWorkflowStageId }
          }
        } = entryWithWorkFlow

        // for get all workflow stages
        let {
          workflows
        } = await getDataFromApi(buildUrl(`workflows`))

        const stages = await findWorkFlowstages(currentWorkflowStageId, workflows[0].workflow_stages)
        setWorkflowStageData(stages);
        setLoading(false);
      }else {
        setWorkflowStageData([]);
        setLoading(false);
      }
    }
    catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    if(showModal) getworkflowsStages();
  }, [showModal]);

  return ({
    loading,
    error,
    stages: workflowStageData
  })
}

export default useGetWorkFlowStages