import gql from 'graphql-tag';

const userFragment = gql`
  fragment UserFragment on User {
    id
    fullName
    firstName
    lastName
    isManager
    accountImageUrl
    accountIconUrl
    languagePreference
    accountId
    accountName
    userIdentity
    managerUserId
    managerName
    hasTerritory
    isSupervisor
    isAllowedForTeamPage
    isAllowedForClientAdminPage
    todayActivityStats {
      isTrackedFromFrontEndPageView
      isTrackedFromSfdcSalesToolsPageView
    }

    profilePictureUrl
    isManagerOfManager
    isMoreThanOneCourseAssigned
    isAnyLevelOneCollectionCompletedByUser
    isUserAssignedCoursesHasPractice
    userProfile {
      id
      course {
        id
        title
        levelCourseType
        outlineUrl
        activityStatus
        userActivityPoints
        isFirstLevelOneCollectionCompletedByUser
        userCoursePractice {
          id
        }
        selectedGoals {
          id
          title
        }
        isCourseEnabled
        courseProgress {
          canUserSeeNpsSurvey
        }
        status
      }
    }
    isClientAdmin
  }
`;

const userSessionFragment = gql`
  fragment UserSessionFragment on UserSession {
    id
    osInfo
    browserInfo
    deviceInfo
    ipAddress
    createdAt
    isCurrent
  }
`;

export { userFragment, userSessionFragment };
