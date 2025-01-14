import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

const useCourseVersionsToCheckCompatible = ({
  courseId,
  compatibilityCheckPopup
}) => {
  const [loading, setLoading] = useState(false);
  const [courseCheckVersionCompatibleData, setCourseCheckVersionCompatibleData] = useState([])
  const [errorMessage, setErrorMessage] = useState("")


  useEffect(() => {
    const controller = new AbortController();
    if (compatibilityCheckPopup) {
      // setLoading(false);
      // setErrorMessage("");
      getCheckCourseCompatibleVersion(controller);
    }
    return () => {
      controller.abort()
    }
  }, [courseId, compatibilityCheckPopup])

  const getCheckCourseCompatibleVersion = async (controller) => {
    setLoading(true);
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
      const response = await fetch(`${process.env.REACT_APP_VALIDATE_SERVICE__GET_AVAILABLE_COURSES_FOR_COMPATIBLITY}?course_parent_item_id=${courseId}`, config);
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        setCourseCheckVersionCompatibleData(jsonResponse)
        setLoading(false)
      }
      else {
        setErrorMessage(jsonResponse.errors)
        setLoading(false)
      }
      setLoading(false)
    }
    catch (error) {
      if (error.name !== 'AbortError') {
        setErrorMessage(error.message);
        setLoading(false);
      }
    }
  }
  return {
    data: isEmpty(courseCheckVersionCompatibleData.records) ? null : courseCheckVersionCompatibleData,
    errorMessages: errorMessage,
    loading: loading
  }
}

export default useCourseVersionsToCheckCompatible;