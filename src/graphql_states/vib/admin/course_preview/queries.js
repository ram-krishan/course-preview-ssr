import gql from 'graphql-tag';
import { subRowFieldsFragment, subRowsRecursiveFragment } from './fragments';

const GET_COURSE_VERSIONS = gql`
  query courseVersions(
    $courseCmsId: String!,
    $courseTypename: String!,
  ){
    courseVersions(courseCmsId: $courseCmsId, courseTypename: $courseTypename) {
      id
      levelCourseId
      cmsVersion
      createdAt
      formattedCreatedAt
      courseVersionLabels
      isValid
    }
  }
`;

const GET_COURSE_PREVIEW_COMPARISON_DATA = gql`
  query coursePreviewComparisonData(
    $sourceCourseVersionId: ID!,
    $targetCourseVersionId: ID!
  ){
    coursePreviewComparisonData(
      sourceCourseVersionId: $sourceCourseVersionId,
      targetCourseVersionId: $targetCourseVersionId
    ) {
      ...SubRowFields
      ...SubRowsRecursive
    }
  }
  ${subRowFieldsFragment}
  ${subRowsRecursiveFragment}
`;

export {
  GET_COURSE_VERSIONS,
  GET_COURSE_PREVIEW_COMPARISON_DATA,
};
