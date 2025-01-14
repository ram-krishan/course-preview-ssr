import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { Modal, Row, Col, Form, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import AlertMessage from '../../shared/AlertMessage';
import Loader from '../../shared/Loader';
import useCreateCourseCompatiblity from './hooks/useCreateCourseCompatiblity';
import ShowCourseCompatibleResponse from './ShowCourseCompatibleResponse';
import useCourseVersionsToCheckCompatible from './hooks/useCourseVersionsToCheckCompatible';

const CompatibilityCheckPopup = ({
  compatibilityCheckPopup = false,
  closeModal = () => { },
  courseRecord,
  courseId
}) => {
  const { data: courseVersionCompatibleData,
    errorMessages: courseVersionCompatibleErrorMessages,
    loading: courseVersionCompatibleLoading
  } = useCourseVersionsToCheckCompatible({ courseId, compatibilityCheckPopup })

  const [courseIdAndCompatibleId, setcourseIdAndCompatibleId] = useState({
    courseId,
    compatibleCourseId: null,
    cmsContentTypeId: courseRecord.cms_content_type_id,
    courseCmsId: courseRecord.course_cms_id
  })
  const [displayResponseCourseCompatible, setDisplayResponseCourseCompatible] = useState(false)
  const { 
    createCompatibileRecord,
    loading,
    checkCourseVersionCompatibleData,
    errorMessage
  } = useCreateCourseCompatiblity();
  const handlerSetCompatibleCourseId = (e) => {
    setcourseIdAndCompatibleId({ ...courseIdAndCompatibleId, compatibleCourseId: e.target.value })
  }

  const closeModalCompatibleIdToBlank = () => {
    setcourseIdAndCompatibleId({ ...courseIdAndCompatibleId, compatibleCourseId: null })
    setDisplayResponseCourseCompatible(false)
    closeModal()
    if (displayResponseCourseCompatible) {
      window.location.reload(true)
    }
  }

  const handlerSubmitForCompatibleRecord = () => {
    createCompatibileRecord(
      courseIdAndCompatibleId.courseId,
      courseIdAndCompatibleId.compatibleCourseId,
      courseIdAndCompatibleId.cmsContentTypeId,
      courseIdAndCompatibleId.courseCmsId,
    )
    setcourseIdAndCompatibleId({ ...courseIdAndCompatibleId, compatibleCourseId: null })
    setDisplayResponseCourseCompatible(true)
  }

  return (
    <Modal show={compatibilityCheckPopup} onHide={closeModalCompatibleIdToBlank} size="lg">
      <Modal.Header closeButton>
        <Row>
          <Col><FormattedMessage id="compatibilityCheckPopup.heading.sourceCourseId" />: {courseId}</Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        {
          displayResponseCourseCompatible ?
            < ShowCourseCompatibleResponse
              courseVersionCompatibleData={courseVersionCompatibleData}
              checkCourseVersionCompatibleData={checkCourseVersionCompatibleData}
              loading={loading}
              errorMessage={errorMessage}
            />
            :
            courseVersionCompatibleErrorMessages ?
              <AlertMessage alertType="danger" message={courseVersionCompatibleErrorMessages} />
              :
              courseVersionCompatibleLoading ?
                <Loader />
                :
                <Form>
                  {
                    isEmpty(courseVersionCompatibleData && courseVersionCompatibleData.records) ?
                      <FormattedMessage id="courseVersionCompatible.table.noRecordsAvailable" /> :
                      courseVersionCompatibleData && courseVersionCompatibleData.records.map((course) => (
                        <Row key={course.id}>
                          <Form.Check style={{ marginLeft: '20px' }}>
                            <Form.Check.Input
                              type="radio"
                              name="target-course-id"
                              value={course.id}
                              onClick={handlerSetCompatibleCourseId}
                              id={course.id}
                            />
                            <Form.Check.Label
                              onClick={handlerSetCompatibleCourseId}
                              htmlFor={course.id}
                              style={{ marginLeft: '20px' }}
                            >
                              <pre>
                                {course.id}
                              </pre>
                            </Form.Check.Label>
                          </Form.Check>
                        </Row>
                      ))
                  }
                </Form>
        }
      </Modal.Body>

      <Modal.Footer>
        {displayResponseCourseCompatible ?
          <Button 
            className="primary"
            onClick={closeModalCompatibleIdToBlank}
            disabled={loading ? true : false}
          >
            {
              loading ?
                <FormattedMessage id="compatibilityCheckPopup.footer.submittingButton" />
                 :
                <FormattedMessage id="compatibilityCheckPopup.footer.closeButton" />
            } 
          </Button> :
          <Button 
            className="primary"
            onClick={handlerSubmitForCompatibleRecord}
            disabled={courseIdAndCompatibleId.compatibleCourseId && !loading ? false : true}
          >
            <FormattedMessage id="compatibilityCheckPopup.footer.submitButton" /> 
          </Button>
        }
      </Modal.Footer>
    </Modal>
  )
};

export default CompatibilityCheckPopup;