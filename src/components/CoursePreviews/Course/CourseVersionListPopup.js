import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import Loader from '../../shared/Loader';
import AlertMessage from '../../shared/AlertMessage';
import { vibGraphqlStates } from '../../../graphql_states';
import previewClient from '../../../preivewApolloClient';
import VibTable from '../../../components/admin/shared/VibTable';
import VibButton from '../../shared/vib_button';
import './course-version-style.scss';

const CourseVersionListPopup = ({
  selectedCourse,
  compareCourseVesrionPopupVisibility,
  toggleModal,
  selectedCourseVersions,
  setSelectedCourseVersions,
  setIsComparingCourseVersion,
}) => {
  const { data, error, loading } = useQuery(
    vibGraphqlStates.admin.coursePreview.queries.GET_COURSE_VERSIONS,
    {
      variables: {
        courseCmsId: selectedCourse.value,
        courseTypename: selectedCourse.typename,
      },
      client: previewClient,
      fetchPolicy: 'network-only',
    },
  );
  if (loading) return <Loader />;
  if (error) {
    const errorObject = error;
    return (
      <AlertMessage
        alertType="danger"
        customClass="m-3"
        message={errorObject && errorObject.graphQLErrors}
      />
    );
  }

  const handleCourseVersionSelectionChange = (event, courseVersion) => {
    let courseVersions = [...selectedCourseVersions];

    if (event.target.checked) {
      courseVersions = [...courseVersions, courseVersion];
    } else {
      courseVersions = courseVersions.filter((version) => version.id !== courseVersion.id);
    }

    setSelectedCourseVersions(courseVersions);
  };

  const isCourseVersionSelected = (courseVersionId) => {
    const result = selectedCourseVersions.filter(
      (version) => version.id === courseVersionId,
    );
    return result.length > 0;
  };

  const checkBox = (course) => (
    <input
      className="ml-2"
      type="checkbox"
      checked={isCourseVersionSelected(course.id)}
      onChange={(event) => handleCourseVersionSelectionChange(event, course)}
      disabled={selectedCourseVersions.length === 2 && !isCourseVersionSelected(course.id)}
    />
  );

  const badegeForValid = (isValid) => (
    isValid
      ? (
        <span className="badge badge-success mx-2">
          <FormattedMessage id="coursePreview.label.valid" />
        </span>
      )
      : (
        <span className="badge badge-danger mx-2">
          <FormattedMessage id="coursePreview.label.inValid" />
        </span>
      )
  );

  const handleCompareCourseVersion = () => {
    setIsComparingCourseVersion(true);
    toggleModal();
  };

  const columns = [
    {
      Header: <span />,
      accessor: 'levelCourseId',
      disableSortBy: true,
      Cell: (props) => (
        checkBox(props.row.original)
      ),
    },
    {
      Header: <span><FormattedMessage id="coursePreview.compare.table.heading.courseVersionId" /></span>,
      accessor: 'id',
      disableSortBy: true,
      Cell: (props) => (
        <span>
          {props.value}
        </span>
      ),
    },
    {
      Header: <span><FormattedMessage id="coursePreview.compare.table.heading.label" /></span>,
      accessor: 'courseVersionLabels',
      disableSortBy: true,
      Cell: (props) => (
        props.value.map(
          (label) => <span className="badge badge-secondary mr-2">{label}</span>,
        )
      ),
    },
    {
      Header: <span><FormattedMessage id="coursePreview.compare.table.heading.cmsVersion" /></span>,
      accessor: 'cmsVersion',
      disableSortBy: false,
      Cell: (props) => (
        <span>
          {props.value}
        </span>
      ),
    },
    {
      Header: <span><FormattedMessage id="coursePreview.compare.table.heading.createdAt" /></span>,
      accessor: 'formattedCreatedAt',
      disableSortBy: false,
      sortType: (a, b) => new Date(a.original.formattedCreatedAt) - new Date(b.original.formattedCreatedAt),
      Cell: (props) => (
        <span>
          {props.value}
        </span>
      ),
    },
    {
      Header: <span><FormattedMessage id="coursePreview.compare.table.heading.valid" /></span>,
      accessor: 'isValid',
      disableSortBy: false,
      Cell: (props) => (
        <span>
          {badegeForValid(props.value)}
        </span>
      ),
    },
  ];
  return (
    <Modal show={compareCourseVesrionPopupVisibility} onHide={toggleModal} size="xl">
      <Modal.Header closeButton>
        <FormattedMessage id="coursePreview.heading.courseVesrsions" />
      </Modal.Header>

      <Modal.Body>
        {
        !isEmpty(data.courseVersions)
          ? (
            <VibTable
              columns={columns}
              data={data.courseVersions}
              extraClassName="course-version-list-popup-table"
            />
          )
          : <h4><FormattedMessage id="coursePreview.compare.heading.noCourseVersions" /></h4>
      }
      </Modal.Body>

      <Modal.Footer>
        {!isEmpty(data.courseVersions)
          ? (
            <VibButton
              handleSubmit={handleCompareCourseVersion}
              isDisabled={selectedCourseVersions.length !== 2}
            >
              <FormattedMessage id="coursePreview.btn.compare" />
            </VibButton>
          )
          : null }
      </Modal.Footer>
    </Modal>
  );
};

export default CourseVersionListPopup;
