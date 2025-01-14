import { useState } from 'react'

const useCreateCourseCompatiblity = () => {

  const [loading, setLoading] = useState(false);
  const [checkCourseVersionCompatibleData, setCheckCourseVersionCompatibleData] = useState({})
  const [errorMessage, setErrorMessage] = useState(false)

  const createCompatibileRecord = async (
    courseId,
    compatibleCourseId,
    cmsContentTypeId,
    courseCmsId
  ) => {
    const postCourseCompatibleVersionDataEndpoint = process.env.REACT_APP_VALIDATE_SERVICE__POST_COMPATIBLE_COURSE_VERSIONS;

    setLoading(true);
    const requestBody = {
      "course_item_record_id_1": courseId,
      "course_item_record_id_2": compatibleCourseId,
      "cms_content_type_id": cmsContentTypeId,
      "course_cms_uid": courseCmsId,
    }
    const config = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'x-api-key': process.env.REACT_APP_VALIDATE_SERVICE__X_API_KEY,
        'Content-Type': 'application/json'
      }
    }
    try {
      setLoading(true)
      const response = await fetch(postCourseCompatibleVersionDataEndpoint, config);
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        setCheckCourseVersionCompatibleData(jsonResponse)
      }
      else {
        setErrorMessage(jsonResponse.errors)
      }
      setLoading(false)
    }
    catch (error) {
      setLoading(false)
      setErrorMessage(error)
    }
  }
  return { createCompatibileRecord, loading, checkCourseVersionCompatibleData, errorMessage }
}

export default useCreateCourseCompatiblity