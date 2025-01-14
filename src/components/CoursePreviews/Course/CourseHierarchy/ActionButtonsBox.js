import React, {useState, useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom'

import WorkFlowModal from './WorkFlowModal';
import ValidateDataErrorModal from './ValidateDataErrorModal';
import { Button, Row, Col } from 'react-bootstrap';
import './course-hierarchy-v2-style.scss';
import Alert from 'react-bootstrap/Alert';
import VibButton from '../../../shared/vib_button';
import ErrorAlertIcon from '../../../assets/images/error-alert.png'
import { Link } from 'react-router-dom';
import {contentStackObjectNameMappings} from './utils';
import CourseValidationContext from './context/courseValidationContext';
import { useStartCourseValidation } from '../hooks/useStartCourseValidation';
import '../course-version-style.scss';
import Loader from '../../../shared/Loader';
import { useAdminPortal } from "../hooks/useAdminPortal";

const courseLevelMappings = {
  l2: 'level_2_course',
  l3: 'level_3_course',
}

const ActionButtonsBox = ({
  selectedCourse,
  canExpandAll,
  handleExpandAll,
  canCollapseAll,
  handleCollapseAll,
  isExpandedAllLoading,
  locale,
  setRefetchWorkFlowStatus,
  courseMetaData,
}) => {
  const history = useHistory();
  const {cms_id, course_level } = useParams();
  const [showWorkFlowModal, setShowWorkFlowModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");


  const {
    validationStatus,
    lastValidatedAt,
    getCourseId,
    isValidationNotRunning,
    courseValidationRecord,
    showValidateDetailsModal,
    setShowValidateDetailsModal
    } = useContext(CourseValidationContext);

    const {
      loading: startCourseApiCalling,
      startCourseValidation
      } = useStartCourseValidation({selectedCourse, locale, setErrorMessage});


  const objectMapping = contentStackObjectNameMappings(selectedCourse.typename);

  const handleWorkflowStagesModal = () =>{
    setShowWorkFlowModal(true)
  }

  const handlefetchValidationStatus = () => {
    startCourseValidation();
  }

  const handleClose = () => setShowWorkFlowModal(false);

  const { course_description, duration } = courseMetaData;

  const isAdminPortal = useAdminPortal();

  return (
    <div className="display-5 pl-2 mb-2 ">
      {
        errorMessage.length > 0 &&
        <Alert className="error-alert-banner-style" variant="danger" onClose={() => setErrorMessage("")} dismissible>
           <img
              alt="ErrorAlertIcon"
              className="error-alert-icon-style"
              src={ErrorAlertIcon}
            />
          {errorMessage}
        </Alert>
      }
      <Row>
        <Col className='d-inline-block text-right'>
          {/* { getBadgeForCourseLabel() } */}
          {
            isAdminPortal ? (
              <Button
                disabled={!isValidationNotRunning}
                className="text-right ml-3 px-3 py-2 workflowStage-btn button-custom-mb btn-actions"
                onClick={() => handlefetchValidationStatus()}
              ><h1 id="coursePreview.btn.validateData" />
              </Button>
            ) : null
          }

          <VibButton
            key={`expand-btn-${Math.random()}`}
            handleSubmit={handleExpandAll}
            isLoading={isExpandedAllLoading}
            classes="text-right ml-3 px-3 py-2 button-custom-mb btn-actions expand-all-btn"
            isDisabled={!canExpandAll || isExpandedAllLoading}
          >
            <h1 id="coursePreview.btn.expandAll" />
          </VibButton>

          <VibButton
            key={`collapse-btn-${Math.random()}`}
            handleSubmit={handleCollapseAll}
            classes="text-right ml-3 px-3 py-2 button-custom-mb btn-actions"
            isDisabled={!canCollapseAll}
          >
            <h1 id="coursePreview.btn.collapseAll" />
          </VibButton>
          {
              isAdminPortal ? (
                <Button
                  className="text-right ml-3 px-3 py-2 workflowStage-btn button-custom-mb btn-actions" onClick={() => handleWorkflowStagesModal()}
                  ><h1 id="coursePreview.btn.setWorkflowStage" />
                </Button>
              ) : null
          }
          {
            isAdminPortal ? (
              <VibButton classes="text-right ml-3 px-3 py-2 button-custom-mb btn-actions">
                <Link
                  target="_blank"
                  to={`/compatible-version/${locale}/${courseLevelMappings[course_level]}/${cms_id}`}
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  Check Compatibility
                </Link>
              </VibButton>
            ) : null
          }
        </Col>
      </Row>
      <Row>
        <Link to={{ pathname: `${process.env.REACT_APP_CONTENT_STACK_ENDPOINT}/#!/stack/${process.env.REACT_APP_CONTENT_STACK_GQL_API_KEY}/content-type/${objectMapping.name}/${locale}/entry/${selectedCourse.value}/edit` }} target="_blank">
          {selectedCourse.label}
        </Link>
        <br/>
        <label className="validate-data-text"><strong>Cms Id:</strong></label>&nbsp;{selectedCourse.value}
        <br/>
      </Row>
      <Row>
        {isValidationNotRunning && validationStatus !== "not_validate_yet" ?
            (<div className="validate-data-text">
            <label><strong><h1 id ="coursePreview.validateData.api.course_id"/></strong>&nbsp;{getCourseId}</label>
            </div>)
            : (<div className="validate-data-text">
            <label><strong><h1 id ="coursePreview.validateData.api.course_id"/></strong>&nbsp; <h1 id ="coursePreview.validateData.api.notAvailable"/></label>
            </div>)
         }
      </Row>
      {
        <Row>
          <div className="validate-data-text">
            <label>
              <strong>
                <h1 id ="coursePreview.validateData.api.course_description"/>
              </strong>&nbsp;{course_description}
            </label>
          </div>
        </Row>
      }
      {
        <Row>
          <div className="validate-data-text">
            <label>
              <strong>
                <h1 id ="coursePreview.validateData.api.duration"/>
              </strong>&nbsp;{duration}
            </label>
          </div>
        </Row>
      }
      <Row>
       {isValidationNotRunning && validationStatus !== "not_validate_yet" ?
          (<div className="validate-data-text">
          <label><strong><h1 id ="coursePreview.validateData.api.text"/></strong>&nbsp;{lastValidatedAt}</label>
          </div>)
          : null
       }
       {(isValidationNotRunning && validationStatus === 'valid') ?
         <div className='validate-data-error'>
           <span className='validate-data-status badge-success badge mr-2'>
             <h1 id="coursePreview.validateData.api.valid" />
           </span>
         </div>
        : null}
       {(isValidationNotRunning && validationStatus === "invalid") ?
         <div className='validate-data-error'>
           <span class="badge-danger badge mr-2 validate-data-status">
             <h1 id="coursePreview.validateData.api.invalid" />
           </span>
         </div> : null}
      {(isValidationNotRunning && validationStatus === "not_validate_yet") ?
         <div className='validate-data-error'>
           <span class="badge badge-warning mr-2 ml-3">
           <h1 id="coursePreview.validateData.api.notValidatedYet" />
           </span>
         </div> : null}

       {isValidationNotRunning ?
        (<Link className='ml-2' onClick={() => setShowValidateDetailsModal(true)}>
            <h1 id="coursePreview.validateData.api.viewDetails" />
         </Link>) : null }
      </Row>
      <WorkFlowModal
        showModal={showWorkFlowModal}
        setShowModal={setShowWorkFlowModal}
        selectedCourse={selectedCourse}
        handleClose={handleClose}
        setErrorMessage={setErrorMessage}
        setRefetchWorkFlowStatus={setRefetchWorkFlowStatus}
      />
      <ValidateDataErrorModal
        showModal={showValidateDetailsModal}
        setShowModal={setShowValidateDetailsModal}
        selectedCourse={selectedCourse}
        courseValidationRecord={courseValidationRecord}
      />
    </div>
  );
};

export default ActionButtonsBox;
