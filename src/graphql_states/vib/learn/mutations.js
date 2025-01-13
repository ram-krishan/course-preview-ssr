import gql from 'graphql-tag';

const START_COURSE = gql`
  mutation StartCourse ($vibCourseId: ID!) {
    startCourse(input: {vibCourseId: $vibCourseId}) {
      success
      errorMessages
      jumpBackIn {
        jumpBackInPath
      }
    }
  }
`;

export {
  START_COURSE,
};
