
import React, { useState } from 'react'
import CompatibilityCheckPopup from './CompatibilityCheckPopup'
import ViewDetailsPopup from './ViewDetailsPopup.js'

import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import VersionCompatibleLogTable from './VersionCompatibleLogTable';

const CourseVersionTable = ({
  course,
  courseId
}) => {

  const [viewDetails, setViewDetails] = useState(false)
  const [compatibilityCheckPopup, setCompatibilityCheckPopup] = useState(false)

  const openViewDetails = () => {
    setViewDetails(true);
  }
  const checkCompatibility = () => {
    setCompatibilityCheckPopup(true);
  }

  const closeModal = () => {
    setCompatibilityCheckPopup(false);
    setViewDetails(false);
  }

  return (
    <React.Fragment>
      <Container>
        <CompatibilityCheckPopup
          compatibilityCheckPopup={compatibilityCheckPopup}
          closeModal={closeModal}
          courseRecord={course.record}
          courseId={courseId}
        />
        <ViewDetailsPopup
          viewDetails={viewDetails}
          closeModal={closeModal}
          courseData={course.record}
        />
        <Card className="compatibility-check-section">
          <Card.Body>
            <Row className="mt-20">
              <Col sm={9} md={6}>
                <h1 id="courseVersionCompatible.courseId" /> {course.record.id}
              </Col>
              <Col className="text-right" sm={3} md={6}>
                <Button
                  variant="outline-primary"
                  className="mr-0 mr-md-2"
                  onClick={() => checkCompatibility()}
                >
                  <h1 id="courseVersionCompatible.compatibilityCheckButton" />
                </Button>
                <Button
                  variant="outline-info"
                  className="mt-2 mt-md-0"
                  onClick={() => openViewDetails()}
                >
                  <h1 id="courseVersionCompatible.viewDetailsButton" />
                </Button>
              </Col>
            </Row>
            <Row className="process-status-section">
              <h1 id="courseVersionCompatible.status" />
              <span className='ml-10'>
                {course.record.status.toUpperCase()}
              </span>
            </Row>
            <Row className="validation-status-section">
              <h1 id="courseVersionCompatible.validationStatus" />
              {
                (course.record.is_available_for_compatiblity_check === true) &&
                <Badge className='ml-10 badge-style' variant='success'>
                  <span className="validation-status-valid-text">
                    <h1 id='courseVersionCompatible.valid' />
                  </span>
                </Badge>
              }
              {
                (course.record.is_available_for_compatiblity_check === false) &&
                <Badge className='ml-10 badge-style' variant='danger'>
                  <span className="validation-status-invalid-text">
                    <h1 id='courseVersionCompatible.invalid' />
                  </span>
                </Badge>
              }
              { (course.record.is_available_for_compatiblity_check === null) &&
                null
              }
            </Row>
            < VersionCompatibleLogTable
              course={course}
            />
          </Card.Body>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default CourseVersionTable