import gql from 'graphql-tag';
import { userFragment, userSessionFragment } from './fragments';

const GET_CURRENT_USER = gql`
  query SessionGetCurrentUser {
    currentUser {
      ...UserFragment
    }
  }
  ${userFragment}
`;

const GET_CURRENT_USER_WITH_ENABLED_FEATURES = gql`
  query SessionGetCurrentUserWithEnableFeatures {
    currentUser {
      ...UserFragment
    }
    enabledFeatures {
      featureList
    }
    globalSetting{
      termsPageBlogId
      privacyPageBlogId
    }
    formattedRailsAppName
  }
  ${userFragment}
`;

const GET_ACTIVE_USER_SESSIONS = gql`
  query {
    userActiveSessions {
      ...UserSessionFragment
    }
  }
  ${userSessionFragment}
`;

export {
  GET_CURRENT_USER,
  GET_CURRENT_USER_WITH_ENABLED_FEATURES,
  GET_ACTIVE_USER_SESSIONS,
};
