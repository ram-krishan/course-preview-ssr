import gql from 'graphql-tag';

const GET_ORGANIZATIONAL_STATS = gql`
  query organizationalStats {
    organizationalStats {
      inactiveAndNotStartedCount
      avgTimePerSession
      activeUsersInLastSevenDays
      totalUserCount
      confirmedUserCount
    }
  }
`;

const GET_USERS_TEAM_REPORTS = gql`
  query getUsersTeamReports(
    $filters: TeamReportFilterAttributes,
    $sortParams: SortParamsAttributes,
    $page: Int!,
    $perPage: Int!,
  ) {
    teamReports(filters: $filters, sortParams: $sortParams, page: $page, perPage: $perPage) {
      nodes {
        id
        userId
        teamMemberName
        courseTitle
        userAverageTimePerSession
        userLastLoginAt
        completeCourseActivitiesPercentage
        assessmentImprovement
        strengthCategory
        opportunityCategory
        isSupervisor
        orgGroupsNameInSupervision
        territoriesNameInSupervision
        userGroupsNameInSupervision
        userActivityPoints
      }
      hasNextPage
      hasPreviousPage
      pagesCount
    }
  }
`;

const GET_SEARCHED_USERS_DATA = gql`
query getUsersTeamReports(
  $filters: TeamReportFilterAttributes,
  $searchTerm: String,
  $page: Int!,
  $perPage: Int!,
) {
  teamReports(filters: $filters, searchTerm: $searchTerm, page: $page, perPage: $perPage) {
    nodes {
      id
      userId
      teamMemberName
    }
  }
}
`;

const GET_CLIENT_ADMIN_FILTER_VALUES = gql`
  query clientAdminFilterValues {
    accountUserFilters {
      courses {
        id
        title
      }
      territories {
        id
        name
      }
      organizationalGroups {
        id
        name
      }
      userGroups {
        id
        name
      }
      managers {
        id
        fullName
      }
      embeddedDataFields {
        fieldName
        values
      }
    }
    
  }
`;


export {
  GET_USERS_TEAM_REPORTS,
  GET_ORGANIZATIONAL_STATS,
  GET_CLIENT_ADMIN_FILTER_VALUES,
  GET_SEARCHED_USERS_DATA,
};
