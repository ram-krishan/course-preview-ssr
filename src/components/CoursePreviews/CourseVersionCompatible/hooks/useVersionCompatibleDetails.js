import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

const useVersionCompatibleDetails = ({
    versionCompatibilityLogId,
    courseCmdId,
    viewResult
  }) => {

  useEffect(() => {
    const controller = new AbortController()
    if (viewResult) {
      getVersionCompatibleDetails(controller);
    }

    return () => {
      controller.abort()
    }
  }, [versionCompatibilityLogId, courseCmdId, viewResult])

  const [loading, setLoading] = useState(false);
  const [versionCompatibilityLogData, setVersionCompatibilityLogData] = useState({})
  const [errorMessage, setErrorMessage] = useState("")

  const getVersionCompatibleDetails = async (controller) => {
    setLoading(true);

    const getCourseCompatibleVersionDataEndpoint = `${process.env.REACT_APP_VALIDATE_SERVICE__GET_COMPATIBILITY_VALIDATION_STATUS}?course_cms_uid=${courseCmdId}&version_compatibility_validation_log_id=${versionCompatibilityLogId}`;
    const config = {
      method: 'GET',
      headers: {
        'x-api-key': process.env.REACT_APP_VALIDATE_SERVICE__X_API_KEY,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    }
    try {
      setLoading(true)
      const response = await fetch(getCourseCompatibleVersionDataEndpoint, config);
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        setVersionCompatibilityLogData(jsonResponse)
      }
      else {
        setErrorMessage(jsonResponse.errors)
      }
      setLoading(false)
    }
    catch (error) {
      if (error.name !== 'AbortError') {
        setLoading(false)
        setErrorMessage(error.message)
      }
    }
  }

  return {
    data: isEmpty(versionCompatibilityLogData) ? null : versionCompatibilityLogData,
    errorMessages: errorMessage,
    loading: loading
  }
}

export default useVersionCompatibleDetails