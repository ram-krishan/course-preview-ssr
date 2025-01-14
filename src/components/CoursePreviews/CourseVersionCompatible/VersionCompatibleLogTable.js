
import React, { useState } from 'react'
import { Row, Table, Button, Badge } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import ViewResultPopup from './ViewResultPopup'

const VersionCompatibleLogTable = ({
  course
}) => {
  const [viewResult, setViewResult] = useState(false)
  const [selectedCourseVersionLog, setSelectedCourseVersionLog] = useState(null);

  const closeModal = () => {
    setSelectedCourseVersionLog(null)
    setViewResult(false);
  }
  const openViewResult = (versionLog) => {
    setSelectedCourseVersionLog(versionLog)
    setViewResult(true);
  }

  return (
    <>
      <ViewResultPopup
        viewResult={viewResult}
        closeModal={closeModal}
        versionLog={selectedCourseVersionLog}
				courseCmdId={course.record.course_cms_id}
      />
      <Row className="mt-20">
        <h3><FormattedMessage id="courseVersionCompatible.tableHeading" /></h3>
        <Table striped >
          <thead>
            <tr>
              <th><FormattedMessage id="courseVersionCompatible.table.courseId" /></th>
              <th><FormattedMessage id="courseVersionCompatible.table.checkStartedAt" /></th>
              <th><FormattedMessage id="courseVersionCompatible.table.processingTime" /></th>
              <th><FormattedMessage id="courseVersionCompatible.table.status" /></th>
              <th><FormattedMessage id="courseVersionCompatible.table.isCompatible" /></th>
              <th></th>
            </tr>
          </thead>
          {!isEmpty(course.version_compatible_validation_logs) ?
            <tbody>
              {course.version_compatible_validation_logs.map((versionLog) => (
                <React.Fragment key={versionLog.id}>
                  <tr key={versionLog.id}>
                    <td>{versionLog.course_version_2}</td>
                    <td>{versionLog.created_at}</td>
                    <td>{versionLog.validation_duration}</td>
                    <td>{versionLog.status}</td>
                    <td>
                      {
                        versionLog.is_valid == null ?
                          null : versionLog.is_valid == true ?
                          <Badge variant="success">
                            <FormattedMessage id="courseVersionCompatible.table.compatible" />
                          </Badge>
                          :
                          <Badge variant="danger">
                            <FormattedMessage id="courseVersionCompatible.table.notCompatible" />
                          </Badge>
                      }
                    </td>
                    <td>
                    { versionLog.is_valid == null ?
                      null : versionLog.is_valid === true && (
                      <a href={versionLog.s3_file_url} target="_blank" rel="noreferrer">
                        <FormattedMessage id="courseVersionCompatible.table.exportCsv" />
                      </a>
                    )}
                    </td>
                    <td>
                      <Button variant="outline-info" id={versionLog.id} className="float-right" onClick={() => openViewResult(versionLog)}>
                        <FormattedMessage id="courseVersionCompatible.table.viewResultButton" />
                      </Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
            :
            <tbody>
              <tr>
                <td colspan="15" class="text-center">
                  <FormattedMessage id="courseVersionCompatible.table.noRecordsAvailable" />
                </td>
              </tr>
            </tbody>
          }
        </Table>
      </Row>
    </>
  )
}

export default VersionCompatibleLogTable  