import { useState } from 'react';

export const useWorkFlowCancel = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  
  const cancelCourseWorkFlow = async (args)=>{
    const config = {
      method: 'POST',
      body: JSON.stringify(args),
      headers: {
        'x-api-key': process.env.REACT_APP_COURSE_WORKFLOW_UPDATE_SERVICE_API_KEY,
        'Content-Type': 'application/json'
      }
    }
    try{
      setLoading(true)
      const response = await fetch(process.env.REACT_APP_COURSE_WORKFLOW_CANCEL_ENDPOINT, config);
      const json_response = await response.json();
      if(json_response.success){
        setIsSuccess(true)
      }else{
        setErrorMessage(json_response.error_message)
      }
      setLoading(false)
    }
    catch(error){
      setLoading(false)
      console.log(error);
    }
  }

  return [isSuccess, errorMessage, loading, setIsSuccess, setErrorMessage, cancelCourseWorkFlow]
}
