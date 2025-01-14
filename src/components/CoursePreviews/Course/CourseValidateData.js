import React, { useContext } from 'react';
import Loader from '../../shared/Loader';

import Alert from 'react-bootstrap/Alert';
import WarningAlertIcon from '../../assets/images/warning_alert_icon.png'
import ProgressBar from 'react-bootstrap/ProgressBar'
import CourseValidationContext from '../../../components/CoursePreviews/Course/CourseHierarchy/context/courseValidationContext';

import './course-version-style.scss';

const CourseValidateData = ({
}) => {
  const {
    selectedCourse,
    courseDismissed,
    setCourseDismissed,
    loading,
    completedPercentage,
    isValidationNotRunning } = useContext(CourseValidationContext);

  if (loading) return <Loader />
  if (isValidationNotRunning || courseDismissed) return null;

  const  dismissCourseAlert = () => {
    setCourseDismissed(true);
  }

  return (
    <div className="display-5 pl-2 mb-2 w-100">

      <Alert data-cms-course={JSON.stringify(selectedCourse.value)} key={selectedCourse.value} variant="warning" className="warning-alert-banner" onClose={() => dismissCourseAlert()} dismissible >
        <img
          alt="warningAlertIcon"
          className="alert-icon-style"
          src={WarningAlertIcon}
        />
        <span className="alert-banner-style">
          <h1
            id="coursePreview.validateData.api.processed"
            values={{
              courseName: selectedCourse.label}}
            />
            <ProgressBar animated variant="info" now={completedPercentage} label={`${completedPercentage}%`} />
          </span>
        </Alert>
    </div>
  )
}

export default CourseValidateData;
