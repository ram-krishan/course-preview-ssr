import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AlertMessage from '../../shared/AlertMessage';
import Loader from '../../shared/Loader';
import { VibExpandableTable } from '../../shared/vib_react_table';
import { vibGraphqlStates } from '../../../graphql_states';
import previewClient from '../../../preivewApolloClient';
import { getEntryName, getContentType } from './shared';

const CompareCourseVersionTreeList = ({
  sourceCourseVersionId,
  targetCourseVersionId,
  selectedCourse,
}) => {
  const showObjectErrorMessages = (errorMessages) => {
    if (isEmpty(errorMessages)) return null;

    return (
      <>
        <div className="text-danger ml-4 mt-2 pl-2">Errors: </div>
        <ul className="mt-2 ml-3">
          {
            errorMessages.map((errorMessage) => (
              <li className="text-danger text-wrap text-break">
                {errorMessage}
              </li>
            ))
          }
        </ul>
      </>
    );
  };

  const getInValidBadgeHtml = (object) => (
    object.isValid !== null && !object.isValid
      ? (
        <>
          <span className="badge badge-danger mx-2">
            <FormattedMessage id="coursePreview.label.inValid" />
          </span>
          { showObjectErrorMessages(object.errorMessages) }
        </>
      )
      : ''
  );

  const getDiffIndicator = (object) => {
    if (!object.isEqual) {
      return (
        <span className="ml-1 diff-indicator">{'\u2B24'}</span>
      );
    }
  };

  const cmsPath = (entry) => (
    `${process.env.REACT_APP_CONTENT_STACK_ENDPOINT}/#!/stack/${process.env.REACT_APP_CONTENT_STACK_GQL_API_KEY}/content-type/${getEntryName(entry.typename)}/en-us/entry/${entry.cmsId}/edit`
  );

  const comparePath = (entry) => (
    `${process.env.REACT_APP_CONTENT_STACK_ENDPOINT}/#!/stack/${process.env.REACT_APP_CONTENT_STACK_GQL_API_KEY}/content-type/${getEntryName(entry.typename)}/en-us/en-us/entry/${entry.cmsId}/version-difference/${entry.sourceCmsVersion}/${entry.targetCmsVersion}`
  );

  const l2BreakRoomPath = (entry) => (
    `/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${entry.contentType}/l2/${entry.cmsId}/preview`
  );

  const pagePath = (entry) => (`/course-preview/page/${entry.cmsId}/preview`);
  const questionPath = (entry) => (`/course-preview/exam/${entry.parentCmsId}/question/${entry.cmsId}/preview`);

  const assessmentQuestionPath = (entry) => `/course-preview/assessment/${entry.parentOfParentCmsId}/exam/${entry.parentCmsId}/question/${entry.cmsId}/preview`;

  const getPath = (entry) => {
    switch (entry.typename) {
      case 'Level2':
        return (l2BreakRoomPath(entry));
      case 'Pagev4':
        return (pagePath(entry));
      case 'Question':
        return (questionPath(entry));
      case 'AssessmentQuestion':
        return (assessmentQuestionPath(entry));
      default:
        throw new Error(`Sorry, we are out of ${entry.typename}.`);
    }
  };

  const formateName = (value) => {
    if (value.parentId === null) {
      return (
        <>
          { value.name }
          { getInValidBadgeHtml(value) }
        </>
      );
    }
    return (
      <span>
        <span className="badge badge-info mr-2">
          {getContentType(value.typename)}
        </span>
        { value.name }
        { getInValidBadgeHtml(value) }
        { getDiffIndicator(value) }
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        id: 'expander',
        Header: 'Name',
        accessor: 'name',
        Cell: (props) => (
          <>
            <div className="d-flex flex-wrap align-items-center">
              <span
                {...props.row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${(props.row.depth + 1) > 8 ? '80px' : `${props.row.depth * 15}px`}`,
                  },
                })}
              >
                { props.row.canExpand ? (
                  <button type="button" className={`collapse-icon ${props.row.isExpanded ? 'expanded' : 'collapsed'}`}>
                    <ArrowRightIcon />
                  </button>
                ) : <span className="empty-spn">NA</span>}
              </span>
              <span>
                {formateName(props.row.original)}
              </span>
            </div>
          </>
        ),
      },
      {
        Header: () => <span className="d-block">Measurement Category</span>,
        accessor: 'measurementCategory',
        Cell: (props) => (
          <span>{props.row.original.measurementCategoryTitles}</span>
        ),
      },
      {
        Header: () => <span className="d-block">Activity Points</span>,
        accessor: 'activityPoints',
        Cell: (props) => (
          <span>{props.row.original.activityPoints}</span>
        ),
      },
      {
        Header: () => <span className="d-block">CMS</span>,
        accessor: 'cms',
        Cell: (props) => {
          const { original } = props.row;
          if (original.parentId === null) {
            return ('');
          }
          if (original.isEqual) {
            return (
              <div>
                <div>
                  <Link to={{ pathname: cmsPath(original) }} target="_blank">
                    Open CMS
                  </Link>
                </div>
              </div>
            );
          }
          return (
            <div>
              <div>
                <Link to={{ pathname: comparePath(original) }} target="_blank">
                  Compare
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        Header: () => <span className="d-block">Preview</span>,
        accessor: 'preview',
        Cell: (props) => {
          const value = props.row.original;
          if (['Level2', 'Pagev4', 'Question', 'AssessmentQuestion'].includes(value.typename)) {
            return (
              <div>
                <div>
                  <Link to={{ pathname: getPath(value) }} target="_blank">
                    Preview
                  </Link>
                </div>
              </div>
            );
          }
          return ('');
        },
      },
    ],
    [],
  );

  const { data, error, loading } = useQuery(
    vibGraphqlStates.admin.coursePreview.queries.GET_COURSE_PREVIEW_COMPARISON_DATA,
    {
      variables: {
        sourceCourseVersionId,
        targetCourseVersionId,
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
  return (
    <VibExpandableTable
      columns={columns}
      tableData={data.coursePreviewComparisonData}
    />
  );
};

export default CompareCourseVersionTreeList;
