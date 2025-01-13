import gql from 'graphql-tag';

const GET_VIB_LEVEL_TWO_COURSE = gql`
  query VibLevelTwoCourse($vibCourseId: ID!, $vibLevelTwoCollectionCourseId: ID!) {
    vibLevelTwoCourse(vibCourseId: $vibCourseId) {
      id
      assessment{
        id
        title
        activityPoints
      }
      isAllCoreContentCompleted
      hasEnrichmentStarted
      userCourseProgress {
        id
        status
        __typename
      }
      jumpBackIn(vibLevelTwoCollectionCourseId: $vibLevelTwoCollectionCourseId) {
        levelTwoCollectionIntroText
      }
      currentCourseLevelTwoCollection(vibLevelTwoCollectionCourseId: $vibLevelTwoCollectionCourseId) {
        id
        isUserAllowToVisit(vibLevelTwoCollectionCourseId: $vibLevelTwoCollectionCourseId)
        levelTwoCollection {
          id
          firstLevelTwoLevelOneCollection {
            id
            levelOneCollection {
              id
              title
            }
          }
        }
        levelTwoCollectionProgress(vibCourseId: $vibCourseId) {
          id
        }
      }

      previousCourseLevelTwoCollection(vibLevelTwoCollectionCourseId: $vibLevelTwoCollectionCourseId) {
        id
        levelTwoCollection {
          id
          title
          outroText
          activityPoints
        }
      }
      canStartCourse
      isCourseEnabled
      canShowAssessmentTitle(vibLevelTwoCollectionCourseId: $vibLevelTwoCollectionCourseId)
    }
  }
`;

const GET_CURRENT_LEARN_PATH = gql`
  query getCurrentLearnPath($vibCourseId: ID!) {
    cmsCourse(vibCourseId: $vibCourseId) {
      id
      learnPath
    }
  }
`;

export {
  GET_VIB_LEVEL_TWO_COURSE,
  GET_CURRENT_LEARN_PATH,
};
