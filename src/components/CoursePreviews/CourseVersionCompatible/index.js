import React from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Container, Row, Col, Form, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useCourseCompatibleVersion from './hooks/useCourseCompatibleVersion';
import Loader from '../../shared/Loader';
import useCourseTitleAndDisplayTitle from './hooks/useCourseTitleAndDisplayTitle';
import AlertMessage from '../../shared/AlertMessage';
import CourseVersionTable from './CourseVersionTable.js';
import SearchBoxField from './SearchBoxField';
import './course-version-compatible-style.scss';


const CourseVersionLists = () => {
  const {
    courseType,
    cmsId,
  } = useParams();

  const {
    data,
    errorMessages,
    loading,
    pageTokenList,
    searchText,
    setSearchText,
    publishRequested,
    handlePublishRequested,
    publishRequestedOptions,
    handlePageClick,
    disablePrevious,
    disableNext,
    handleSubmitSearchText,
    handleClearSearchText,
  } = useCourseCompatibleVersion({
    cmsId, courseType
  });

  const {
    title: courseTitle,
    loading: courseTitleLoading
  } = useCourseTitleAndDisplayTitle({ cmsId, courseType })

  const getSelectedOption = () => {
    return publishRequestedOptions.find(option => option.value === publishRequested)
  }

  if (errorMessages) { return <AlertMessage alertType="danger" message={errorMessages} />; }


  return (
    <Container>
      <Row className='mt-5'>
        <Col md={2}>
          <FormattedMessage id="courseVersionCompatible.cmsId" /> {cmsId}
        </Col>
        <Col md={4}>
          <SearchBoxField
            searchText={searchText}
            handleInputChange={setSearchText}
            handleSubmitSearchText={handleSubmitSearchText}
            handleClearSearchText={handleClearSearchText}
          />
        </Col>
        <Col md={2} className='publish-requested-select-section'>
          <Form>
            <FormGroup>
              <Form.Label htmlFor="publish_requested">
                <FormattedMessage id="courseVersionCompatible.publishRequested" />
              </Form.Label>
              <Select
                name="publish_requested"
                value={getSelectedOption()}
                options={publishRequestedOptions}
                onChange={handlePublishRequested}
                menuPlacement="auto"
                minMenuHeight="400"
                inputId='publish_requested'
              />
            </FormGroup>
          </Form>
        </Col>
        {
          loading ? < Loader /> :
            <>
              {
                !isEmpty(pageTokenList) &&
                <Col md={4} className='input-group'>
                  <button
                    className='form-control' onClick={() => handlePageClick('previous')}
                    disabled={disablePrevious()}
                  >
                    <span className={`text-${disablePrevious() ? 'secondary' : 'primary'}`}>
                      <FontAwesomeIcon icon={faArrowLeft} className='mr-2' />
                      <FormattedMessage id='button.previous' />
                    </span>
                  </button>
                  <button className='form-control' onClick={() => handlePageClick('next')}
                    disabled={disableNext()}
                  >
                    <span className={`text-${disableNext() ? 'secondary' : 'primary'}`}>
                      <FormattedMessage id='button.next' />
                      <FontAwesomeIcon icon={faArrowRight} className='ml-2' />
                    </span>
                  </button>
                </Col>
              }
            </>
        }
      </Row>
      {
        loading ? < Loader /> :
          <>
            <Row style={{ 'marginTop': '20px' }}>
              <Col md={4}>
                <FormattedMessage id="courseVersionCompatible.title" />
                {
                  courseTitleLoading ?
                    <Loader />
                    :
                    courseTitle
                }
              </Col>
            </Row>

            {isEmpty(data) ? <AlertMessage alertType="success" message={<FormattedMessage id="courseVersionCompatible.table.noRecordsAvailable" />} /> : data.map((course) => (
              < CourseVersionTable
                key={Math.random()}
                course={course}
                courseId={course.record.id}
              />
            ))}
          </>
      }


    </Container>
  );
};

export default CourseVersionLists;