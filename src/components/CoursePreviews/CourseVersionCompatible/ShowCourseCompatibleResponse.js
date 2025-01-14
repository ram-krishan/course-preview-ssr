import React from 'react'
import AlertMessage from '../../shared/AlertMessage'
import Loader from '../../shared/Loader'

const ShowCourseCompatibleResponse = (
  { courseVersionCompatibleData,
    checkCourseVersionCompatibleData,
    loading,
    errorMessage
  }) => {
  return (
    <>
      {
        loading ? < Loader /> :
          checkCourseVersionCompatibleData.success ?
            <>
              <AlertMessage alertType="success" message="VersionCompatibilityValidationLog created successfully" />
              <AlertMessage alertType="success" message={`STATUS: ${checkCourseVersionCompatibleData.version_compatibility_validation_log.status}`} />
            </>
            :
            <AlertMessage alertType="danger" message={errorMessage} />
      }
    </>
  )
}

export default ShowCourseCompatibleResponse