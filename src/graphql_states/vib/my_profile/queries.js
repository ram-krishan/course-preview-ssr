import gql from 'graphql-tag';

const USER_LEARNING_PROGRESS = gql`
  query userLearningProgress(
    $userId: ID!
    $filter: UserLearningFilterEnum!
    $courseId: ID
  ) {
    userLearningProgress(userId: $userId, courseId: $courseId, filter: $filter) {
      id
      measurementCategoryTitle
      totalQuestion
      totalCorrectAnswer
      percentage
      benchMarkScore
      baseLineScore
      latestScore
      hasLatestScore
      percentIncrease
      formattedPercentIncrease
      latestScoreAssessmentType
      corePercentage
    }
  }
`;

const DIRECT_REPORT_COURSE_SELECTED_GOALS = gql`
  query directReportCourseSelectedGoals(
    $userId: ID!
    $vibCourseid: ID!
  ) {
    directReportCourseSelectedGoals(userId: $userId, vibCourseId: $vibCourseid) {
      id
      selectedGoals(userId: $userId){
        id
        title
      }
    }
  }
`;

const UPCOMING_EVENT = gql`
  query UPCOMING_EVENT(
    $limit: ID!
  ) {
    upcomingEvents(limit: $limit) {
      id
      sessionName
      startDate
      contentName
      date
      month
      city
      state
      country
      taskHours
      startTime
      virtual
      displayName
    }
  }
`;

export {
  USER_LEARNING_PROGRESS,
  DIRECT_REPORT_COURSE_SELECTED_GOALS,
  UPCOMING_EVENT,
};
