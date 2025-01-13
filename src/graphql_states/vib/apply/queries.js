import gql from 'graphql-tag';


const GET_USER_COURSES_LEARNING_RESOURCES = gql`
  query UserCourseLearningResources(
    $perPage: Int!
  ) {
  myCourses{
    id
    title
    courseLearningResourcesCount
    courseLearningResources(first: $perPage){
      pageInfo{
        hasNextPage
        endCursor
      }
      edges{
        node{
          id
          lessonLink
          isLessonLocked
          learningResource {
            id
            text
            title
            imageUrl
            url
          }
        }
      }
    }
  }
}
`;


const GET_COURSE_LEARNING_RESOURCES_PAGE = gql`
  query CourseLearningResourcesPage(
    $vibCourseId: ID!,
    $afterCursor: String,
    $perPage: Int!
  ) {
  cmsCourse(vibCourseId: $vibCourseId){
    id
    courseLearningResources(first: $perPage, after: $afterCursor){
      pageInfo{
        hasNextPage
        endCursor
      }
      edges{
        node{
          id
          lessonLink
          isLessonLocked
          learningResource {
            id
            text
            title
            imageUrl
            url
          }
        }
      }
    }
  }
}
`;

export {
  GET_USER_COURSES_LEARNING_RESOURCES, GET_COURSE_LEARNING_RESOURCES_PAGE,
};
