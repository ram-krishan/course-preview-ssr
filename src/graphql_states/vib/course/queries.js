import gql from 'graphql-tag';

const GET_COURSE_WITH_BASIC_DETAILS = gql`
query getCourseWithBasicDetails($vibCourseId: ID!) {
  cmsCourse(vibCourseId: $vibCourseId) {
    id
    title
    userActivityPoints
    completedPercentage
    isCourseEnabled
  }
}
`;

export { GET_COURSE_WITH_BASIC_DETAILS };
