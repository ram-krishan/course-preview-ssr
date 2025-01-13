import gql from 'graphql-tag';

const GET_VIB_LEVEL_THREE_COLLECTION_COURSE = gql`
  query vibLevelThreeCollectionCourse(
    $vibLevelThreeCollectionCourseId: ID!
    $vibLevelThreeLevelTwoCollectionId: ID!
  ) {
    vibLevelThreeCollectionCourse(
      vibLevelThreeCollectionCourseId: $vibLevelThreeCollectionCourseId
    ) {
      id
      previousCompletedLevelTwoCollection(
        vibLevelThreeLevelTwoCollectionId: $vibLevelThreeLevelTwoCollectionId
      ) {
        id
        title
        outroText
        activityPoints
      }
      levelThreeCourse {
        id
        title
        courseId
        canStartCourse
        isCourseEnabled
        isAllCoreContentCompleted
        hasEnrichmentStarted
        assessment{
          id
          title
          activityPoints
        }
        userCourseProgress {
          id
          status
        }
        jumpBackIn(
          vibLevelThreeCollectionCourseId: $vibLevelThreeCollectionCourseId
          vibLevelThreeLevelTwoCollectionId: $vibLevelThreeLevelTwoCollectionId
        ) {
          levelTwoCollectionIntroText
        }
        currentLevelThreeLevelTwoCollection(vibLevelThreeLevelTwoCollectionId: $vibLevelThreeLevelTwoCollectionId) {
          id
          levelTwoCollection{
            id
            firstLevelTwoLevelOneCollection{
              id
            }
            firstLevelOneCollection{
              id
              title
            }
          }
        }
        currentCourseLevelThreeCollection(vibLevelThreeCollectionCourseId: $vibLevelThreeCollectionCourseId) {
          id
          isUserAllowToVisit(vibLevelThreeCollectionCourseId: $vibLevelThreeCollectionCourseId, vibLevelThreeLevelTwoCollectionId: $vibLevelThreeLevelTwoCollectionId)
          levelThreeCollectionProgress {
            id
            status
            levelTwoCollectionProgresses {
              id
              levelTwoCollectionId
            }
          }
        }
      }
    }
  }
`;

export { GET_VIB_LEVEL_THREE_COLLECTION_COURSE };
