import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';
import WarningAlertIcon from '../../assets/images/warning_alert_icon.png'
import ErrorAlertIcon from '../../assets/images/error-alert.png'
import SuccessAlertIcon from '../../assets/images/success-img.svg'
import ProgressBar from 'react-bootstrap/ProgressBar';
import {useWorkFlowCancel} from './hooks/useWorkFlowCancel'
import Loader from '../../shared/Loader';
import ConfirmCancelWorkFlowModal from './ConfirmCancelWorkFlowModal';
import AlertMessage from '../../shared/AlertMessage'

const CourseWorkflowStatusAlert = ({
  course,
  dismissCourseAlert,
  handleViewDetails,
}) => {

  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);

  const [isSuccess,
    errorMessage,
    loading,
    setIsSuccess,
    setErrorMessage,
    cancelCourseWorkFlow] = useWorkFlowCancel();

  const isErrorOccurred = (course) => course.status === 'error_occurred';

  const handleCancelCourseWorkFlow = ()=>{
    cancelCourseWorkFlow({
      id: course.id
    })
    setShowConfirmCancelModal(false)
  }

  const handleAfterSuccessAlertHide = ()=>{
    setIsSuccess(false)
    dismissCourseAlert(course)
  }

  if (loading) return <Loader/>;

  if(isErrorOccurred(course)){
    return(
      < Alert data-cms-course={JSON.stringify(course)} className = "error-alert-banner-style" variant = "danger" onClose = {() => dismissCourseAlert(course)} dismissible >
        <img
          alt="ErrorAlertIcon"
          className="error-alert-icon-style"
          src={ErrorAlertIcon}
        />
        <span className="alert-banner-style">
          <h1
            id="coursePreview.workflowStage.api.processing.error"
            values={{ courseName: course.name }}
          />
          <Link className='ml-2' onClick={() => handleViewDetails(course)}>
            <h1 id="coursePreview.validateData.api.viewDetails" />
          </Link>
        </span>
      </Alert >
    )
  }

  if(isSuccess){
    return(
      <AlertMessage
        autoHide
        hideTime={30000}
        alertType="success"
        customClass="success-alert-banner-style"
        handleAfterHide={handleAfterSuccessAlertHide}
        message={<>
          <img
            alt="SuccessAlertIcon"
            className="success-alert-icon-style"
            src={SuccessAlertIcon}
          />
          <span className="alert-banner-style">
            <h1
              id="coursePreview.workflowStage.api.cancel.success.message"
            />
          </span>
        </>}
      />
    )
  }

  return (
    <>
      {
        errorMessage &&
        < Alert className = "error-alert-banner-style" variant = "danger" onClose = {() => setErrorMessage(null)} dismissible >
          <img
            alt="ErrorAlertIcon"
            className="error-alert-icon-style"
            src={ErrorAlertIcon}
          />
          <span className="alert-banner-style">
            {errorMessage}
          </span>
        </Alert >
      }

      <Alert data-cms-course={JSON.stringify(course)} variant="warning" className="warning-alert-banner" onClose={() => dismissCourseAlert(course)} dismissible>
        <img
          alt="warningAlertIcon"
          className="alert-icon-style"
          src={WarningAlertIcon}
        />
        <span className="alert-banner-style">
          <h1
            id="coursePreview.workflowStage.api.processed"
            values={{
              courseName: course.name
            }}
          />
          <div className='d-flex'>
            <div className="w-100 mt-1">
              <ProgressBar animated variant="info" now={course.progress_percent} label={`${course.progress_percent}%`} />
            </div>
            <div>
              <Link className='ml-2' onClick={()=>(setShowConfirmCancelModal(true))}>
                <h1 id="coursePreview.setWorkflowStage.btn.cancel" />
              </Link>
            </div>
          </div>
        </span>
      </Alert>
      <ConfirmCancelWorkFlowModal
        closeConfirmCancelModal = {()=>(setShowConfirmCancelModal(false))}
        showConfirmCancelModal={showConfirmCancelModal}
        handleCancelCourseWorkFlow={handleCancelCourseWorkFlow}
      />
    </>
  )
}

export default CourseWorkflowStatusAlert;