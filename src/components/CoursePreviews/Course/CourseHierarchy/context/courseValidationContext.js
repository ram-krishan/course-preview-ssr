import React, { useState } from 'react';
import {useCourseValidationStatus} from '../../hooks/useCourseValidationStatus';

const CourseValidationContext = React.createContext();
CourseValidationContext.displayName = "CourseValidationContext";

const CourseValidationProvider = ({selectedCourse, locale, children}) => {
  const [refetchCourseValidationStatus, setRefetchCourseValidationStatus] = useState(false);
  const [courseDismissed, setCourseDismissed] = useState(false);
  const [isCourseValidating, setIsCourseValidating] = useState(false);

  const {
    loading,
    validationStatus,
    lastValidatedAt,
    getCourseId,
    setShowValidateDetailsModal,
    showValidateDetailsModal,
    courseValidationRecord,
    completedPercentage,
    isValidationNotRunning,
    setCourseValidation } = useCourseValidationStatus({
      isCourseValidating,
      setIsCourseValidating,
      selectedCourse,
      locale,
      setErrorMessage: ()=>{}});

  return (
    <CourseValidationContext.Provider value={{
      refetchCourseValidationStatus,
      setRefetchCourseValidationStatus,
      courseDismissed,
      setCourseDismissed,
      isCourseValidating,
      setIsCourseValidating,
      selectedCourse,
      locale,
      completedPercentage,
      isValidationNotRunning,
      loading,
      validationStatus,
      lastValidatedAt,
      getCourseId,
      setShowValidateDetailsModal,
      showValidateDetailsModal,
      courseValidationRecord,
      setCourseValidation,
    }}>
      {children}
    </CourseValidationContext.Provider>
  )
}

export default CourseValidationContext;
export {CourseValidationProvider};