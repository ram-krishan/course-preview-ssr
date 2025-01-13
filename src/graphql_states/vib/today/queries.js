import gql from 'graphql-tag';

const GET_ACTION_PLAN_TASKS = gql`
  query ActionPlanTasks($vibCourseId: ID!) {
    actionPlanTasks(vibCourseId: $vibCourseId) {
      id
      key
      title
      status
      url
      durationMinutes
      activityPoints
      displayTitle
    }
  }
`;

const GET_USER_COURSE_PROGRESS = gql`
  query GET_USER_COURSE_PROGRESS($vibCourseId: ID!, $userId: ID) {
    contentstackCourse(vibCourseId: $vibCourseId, userId: $userId) {
      id
      title
      levelCourseType
      outlineUrl(userId: $userId)
      status
      canStartCourse(userId: $userId)
      isCourseEnabled
      userActivityPoints(userId: $userId)
      courseProgress {
        id
        canUserSeeNpsSurvey
      }
      levelCourse {
        ... on LevelTwoCourse {
          id
          hasCoreExam
          hasEnrichmentExam
          levelTwoCollectionCount
          completedLevelTwoCollectionCount(userId: $userId)
          hasCoreContent
          hasEnrichmentContent
        }
        ... on LevelThreeCourse {
          id
          hasCoreExam
          hasEnrichmentExam
          hasCoreContent
          hasEnrichmentContent
          levelTwoCollectionCount
          completedLevelTwoCollectionCount(userId: $userId)
        }
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
        activityPoints
      }
      courseProgressStats {
        ... on LevelTwoCourseProgressStats {
          id
          coreLessonsCompletedPercentage
          coreLessonsExamCompletedPercentage
          enrichmentLessonsCompletedPercentage
          enrichmentLessonsExamCompletedPercentage
        }
        ... on LevelThreeCourseProgressStats {
          id
          coreLessonsCompletedPercentage
          coreLessonsExamCompletedPercentage
          enrichmentLessonsCompletedPercentage
          enrichmentLessonsExamCompletedPercentage
        }
      }
    }
  }
`;

const GET_TEAM_LEADER_BOARD_MEMBERS = gql`
  query TeamLeaderBoardMembers {
    teamLeaderBoardMembers {
      user {
        id
        fullName
        profilePictureUrl
      }
      courseActivityPoints
      rank
    }
  }
`;
// new design page queries

const GET_ENROLLED_COURSES = gql`
  query EnrolledCourses {
    enrolledCourses {
      id
      title
      goalDate
      startDate
      activityStatus
      status
      outlineUrl
      courseColorCode
      courseProgress {
        id
        canUserSeeNpsSurvey
      }
      canStartCourse
      isFirstLevelOneCollectionCompletedByUser
      levelCourseType
      courseIndexPageUrl
      isCourseEnabled
      jumpBackIn {
        courseId
        jumpBackInPath
      }
      currentUserActionPlanTask {
        id
        url
      }
      checkCourseActivityStartedOrNot
      completedPercentage
      courseProgressStats {
        ... on LevelTwoCourseProgressStats {
          id
          overallCourseCompletePercentage
        }
        ... on LevelThreeCourseProgressStats {
          id
          overallCourseCompletePercentage
        }
      }
    }
  }
`;

const GET_USER_COURSE_PERFORMANCE_DATA = gql`
  query GET_USER_COURSE_PERFORMANCE($vibCourseId: ID!) {
    cmsCourse(vibCourseId: $vibCourseId) {
      id
      userPerformanceResult {
        id
        userActivityPoints
        noOfDaysSinceLastActivity
        assessmentScore
      }
    }
  }
`;

const GET_WIDGETS = gql`
  query GET_WIDGETS {
    widgets {
      id
      widgetOne
      widgetTwo
    }
  }
`;

const GET_WORKFLOW_TOOLS_RESULT = gql`
  query GET_WORKFLOW_TOOLS_RESULT {
    workflowToolsResult {
      totalSosOpportunitiesCount
      totalCallPlanOpportunitiesCount
      openSosPercentage
      openCallPlansPercentage
      closedWonSosPercentage
      closedLostSosPercentage
      closedWonCallPlansPercentage
      closedLostCallPlansPercentage
    }
  }
`;

const EVENT_DATES = gql`
  query EVENT_DATES(
    $limit: ID!
  ) {
    upcomingEvents(limit: $limit) {
      id
      sessionName
      date
      month
      place
      displayName
      virtual
    }
  }
`;

export {
  GET_ACTION_PLAN_TASKS,
  GET_USER_COURSE_PROGRESS,
  GET_ENROLLED_COURSES,
  GET_TEAM_LEADER_BOARD_MEMBERS,
  GET_USER_COURSE_PERFORMANCE_DATA,
  GET_WIDGETS,
  GET_WORKFLOW_TOOLS_RESULT,
  EVENT_DATES,
};
