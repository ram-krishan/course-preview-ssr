import gql from 'graphql-tag';

const CMS_COURSE = gql`
  query cmsCourse(
    $vibCourseId: ID!
  ) {
    cmsCourse(vibCourseId: $vibCourseId) {
      id
      title
      canStartCourse
      isCourseEnabled
      levelCourse {
        id
        ... on LevelThreeCourse {
          id
          title
          learnPageLink
          coreLevelThreeCollectionCourses {
            id
            levelThreeCollection {
              id
              title
            }
            levelThreeCollectionProgress {
              id
              status
              levelThreeCollectionId
            }
          }
          enrichmentLevelThreeCollectionCourses {
            id
            levelThreeCollection{
              id
              title
            }
            levelThreeCollectionProgress {
              id
              status
              levelThreeCollectionId
            }
          }
        }
      }
    }
  }
`;

export {
  CMS_COURSE,
};
