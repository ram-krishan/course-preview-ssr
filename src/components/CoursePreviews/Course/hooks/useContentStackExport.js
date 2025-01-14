import { useState } from 'react';

export const useContentStackExport = ({ setErrorMessage }) => {

  const [loading, setLoading] = useState(false);
  const [showContentStackExportModal, setShowContentStackExportModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const startContentStackExport = (emailAddress) => {
    startContentStackExportData(emailAddress);
  }

  const startContentStackExportData = async(emailAddress) => {
    const requestBody = {
      "email_address": emailAddress
    };

    const config = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'x-api-key': process.env.REACT_APP_COURSE_CONTENT_STACK_EXPORT_API_KEY,
        'Content-Type': 'application/json'
      }
    }
    try{
      setLoading(true)
      const response = await fetch(process.env.REACT_APP_COURSE_CONTENT_STACK_EXPORT_ENDPOINT, config);
      const jsonResponse = await response.json();
      if(response.status === 200){
        setSuccessMessage(jsonResponse["message"]);
      }
      else{
        setErrorMessage(jsonResponse["message"]);
      }
      setLoading(false)
    }
    catch(error){
      setLoading(false)
      setErrorMessage(error.message || "")
    }
  }

  return {
    loading,
    showContentStackExportModal,
    setShowContentStackExportModal,
    startContentStackExport,
    successMessage,
    setSuccessMessage,
  }
}

