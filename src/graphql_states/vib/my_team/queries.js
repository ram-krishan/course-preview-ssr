import gql from 'graphql-tag';

const ASSIGNED_TEAM_COURSES = gql`
  query AssignedTeamCourses {
    assignedTeamCourses {
      id
      title
    }
  }
`;

const TODAY_COACHING_TIP = gql`
  query TodayCoachingTip {
    todayCoachingTip {
      title
      tipText
    }
  }
`;

const COURSE_GOAL_STATS = gql`
  query courseGoalStats($vibCourseId: ID!) {
    courseGoalStats(vibCourseId: $vibCourseId) {
      selectedUserCount
      totalTeamMember
      goal{
        id
        title
      }
    }
  }
`;

const VIB_DIRECT_REPORTS = gql`
  query vibDirectReports($vibCourseId: ID!) {
    vibDirectReports(vibCourseId: $vibCourseId) {
      id
      firstName
      lastName
      colorCode
      profilePictureUrl
      activityStatus(vibCourseId: $vibCourseId)
    }
  }
`;

const VIB_TEAM_REPORTS = gql`
  query vibTeamReports($vibCourseId: ID!, $page: Int, $perPage: Int, $sortColumn: String!,
    $sortDirection: String!) {
    vibTeamReports(vibCourseId: $vibCourseId,
    page: $page,
    perPage: $perPage,
    sortColumn: $sortColumn,
    sortDirection: $sortDirection) {
      pagesCount
      nodesCount
      nodes{
        id
        user {
          id
          email
          firstName
          lastName
          profilePictureUrl
        }
        lastCompletedLevelTwoCollectionType
        activityStatus
        goalDate
        lastCompletedLevelTwoCollectionName
        recentAssessmentAttempt
        recentCompletedAssessmentOverallScore
        courseProgressPercent
      }
    }
  }
`;

const VIB_ALL_TEAM_REPORTS = gql`
  query vibAllTeamReports($vibCourseId: ID!) {
    vibDirectReports(vibCourseId: $vibCourseId) {
      id
      email
      firstName
      lastName
    }
  }
`;

const MANAGER_REPORTS_COURSES = gql`
  query ManagerReportsCourses {
    managerReportsCourses {
      id
      title
    }
  }
`;

const MANAGER_TEAM_REPORTS = gql`
  query ManagerTeamReports($courseId: ID!, $perPage: Int!, $page: Int!, $filterParams: ManagerFilterAttributes, $filteredUserIds: [String!]) {
    getTeamMembers(courseId: $courseId, perPage: $perPage, page: $page, filterParams: $filterParams, filteredUserIds: $filteredUserIds){
      nodes {
        id
        userFullName
        user {
          id
          profilePictureUrl
          email
        }
        courseGoalDate
        courseProgressPercent
        recentAssessmentScore
        recentAssessmentAttempt
        lastCompletedLevelTwoCollectionTitle
        lastCompletedLevelTwoCollectionType
        activityStatus
        assessmentScoreDifference
        managerUserId
        depth
      }
      pagesCount
      hasPreviousPage
      hasNextPage
      nodesCount
    }
  }
`;

const MANAGER_FILTERS = gql`
  query ManagerFilters($userId: ID!) {
    accountUserFilters {
      managers(userId: $userId) {
        id
        fullName
      }
    }
  }
`;

const GET_MANAGER_TEAM_MEMBER_RECORD = gql`
query ManagerTeamReports($courseId: ID!, $perPage: Int!, $page: Int!, $searchTerm: String, $filterParams: ManagerFilterAttributes) {
  getTeamMembers(courseId: $courseId, perPage: $perPage, page: $page, searchTerm: $searchTerm, filterParams: $filterParams){
    nodes {
      user {
        id
        fullName
      }
    }
  }
}`;

export {
  ASSIGNED_TEAM_COURSES,
  COURSE_GOAL_STATS,
  VIB_DIRECT_REPORTS,
  VIB_TEAM_REPORTS,
  TODAY_COACHING_TIP,
  VIB_ALL_TEAM_REPORTS,
  MANAGER_REPORTS_COURSES,
  MANAGER_TEAM_REPORTS,
  MANAGER_FILTERS,
  GET_MANAGER_TEAM_MEMBER_RECORD,
};
