import gql from 'graphql-tag';

const GET_ENROLLED_COURSES = gql`
query enrolledCourses($userId: ID) {
  myCourses(userId: $userId) {
    id
    title
    isCourseEnabled(userId: $userId)
    activityStatus(userId: $userId)
    selectedGoals(userId: $userId) {
      id
      title
    }
  }
}
`;

export { GET_ENROLLED_COURSES };
