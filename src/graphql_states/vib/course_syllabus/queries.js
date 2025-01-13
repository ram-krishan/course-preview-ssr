import gql from 'graphql-tag';

const GET_COURSE_SYLLABUS = gql`
  query VibGetCourseSyllabus(
    $vibCourseId: ID!
  ) {
  actionPlanTasks(vibCourseId: $vibCourseId) {
    id
    key
    title
    status
    url
  }
  cmsCourse(vibCourseId: $vibCourseId){
    id
    status
    title
    courseProgress {
      id
      status
    }
    jumpBackIn {
      courseId
      courseTitle
      levelTwoCollectionId
      levelTwoCollectionTitle
      levelOneCollectionCount
      completedLevelOneCollectionCount
      jumpBackInTitle
      jumpBackInDesc
      jumpBackInPath
    }
    canStartCourse
    isCourseEnabled
    levelCourse {
      id
      __typename
      ... on LevelThreeCourse {
        id
        title
        description
        coreLevelThreeCollectionCourses{
          id
          levelThreeCollectionProgress{
            id
            status
            levelTwoCollectionProgresses {
              id
              status
              levelTwoCollectionId
              levelTwoLearnPageUrl
              levelOneCollectionProgresses {
                id
                status
                levelOneCollectionCmsId
                levelOneCollectionId
                lessonPageUrl
              }
              levelTwoCollectionExamUserProgress {
                id
                status
                examUrl
              }
            }
          }
          levelThreeCollection{
            id
            title
            description
            levelThreeLevelTwoCollections{
              id
              levelTwoCollection{
                id
                title
                description
                levelOneCollections{
                  id
                  cmsId
                  title
                  description
                }
                exam {
                  id
                  title
                }
              }
            }
          }
        }
        enrichmentLevelThreeCollectionCourses{
          id
          levelThreeCollectionProgress{
            id
            status
            levelTwoCollectionProgresses {
              id
              status
              levelTwoCollectionId
              levelTwoLearnPageUrl
              levelOneCollectionProgresses {
                id
                status
                levelOneCollectionCmsId
                levelOneCollectionId
                lessonPageUrl
              }
              levelTwoCollectionExamUserProgress {
                id
                status
                examUrl
              }
            }
          }
          levelThreeCollection{
            id
            title
            description
            levelThreeLevelTwoCollections{
              id
              levelTwoCollection{
                id
                title
                description
                levelOneCollections{
                  id
                  cmsId
                  title
                  description
                }
                exam {
                  id
                  title
                }
              }
            }
          }
        }
      }
      ... on LevelTwoCourse {
        id
        title
        description
        coreLevelTwoCollectionCourses {
          id
          levelTwoCollectionProgress(vibCourseId: $vibCourseId) {
            id
            status
            levelTwoCollectionId
            levelTwoLearnPageUrl
            levelOneCollectionProgresses {
              id
              status
              levelOneCollectionCmsId
              levelOneCollectionId
              lessonPageUrl
            }
            levelTwoCollectionExamUserProgress {
              id
              status
              examUrl
            }
          }
          levelTwoCollection {
            id
            title
            description
            levelTwoLevelOneCollections {
              id
              levelOneCollection {
                id
                cmsId
                title
                description
              }
            }
            exam {
              id
              title
            }
          }
        }
        enrichmentLevelTwoCollectionCourses {
          id
          levelTwoCollectionProgress(vibCourseId: $vibCourseId) {
            id
            status
            levelTwoLearnPageUrl
            levelOneCollectionProgresses {
              id
              status
              levelOneCollectionCmsId
              levelOneCollectionId
              lessonPageUrl
            }
            levelTwoCollectionExamUserProgress {
              id
              status
              examUrl
            }
          }
          levelTwoCollection {
            id
            title
            description
            levelTwoLevelOneCollections {
              id
              levelOneCollection {
                id
                cmsId
                title
                description
              }
            }
            exam {
              id
              title
            }
          }
        }
      }
    }
  }
}
`;

export {
  GET_COURSE_SYLLABUS,
};
