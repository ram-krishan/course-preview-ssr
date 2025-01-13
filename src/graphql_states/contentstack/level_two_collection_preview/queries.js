import gql from 'graphql-tag';

const GET_LEVEL_TWO_COLLECTION_CONTENT = gql`
  query GetLevelTwoCollectionPreview($levelTwoCollectionCmsId: String!, $locale: String!) {
    level_2(uid: $levelTwoCollectionCmsId, locale: $locale, fallback_locale: true) {
      title
      system {
        uid
      }
      lessonsConnection(limit: 1) {
        edges {
          node {
            ... on Level1 {
              title
              system {
                uid
                version
              }
              pagesConnection(limit: 1) {
                edges {
                  node {
                    ... on Pagev4 {
                      title
                      url
                      system {
                        uid
                      }
                    }
                  }
                }
              }
              metadata {
                display_title
              }
            }
          }
        }
      }
      metadata {
        intro_textConnection {
          edges {
            node {
              ... on Text {
                title
                text
              }
            }
          }
        }
        outro_textConnection {
          edges {
            node {
              ... on Text {
                title
                text
              }
            }
          }
        }
      }
    }
  }
`;

const GET_LEVEL_TWO_COLLECTION_OUTRO_TEXT = gql`
  query GetLevelTwoCollectionOutroText($levelTwoCollectionCmsId: String!, $locale: String!) {
    level_2(uid: $levelTwoCollectionCmsId, locale: $locale, fallback_locale: true) {
      title
      activity_points {
        activity_points
      }
      metadata {
        outro_textConnection {
          edges {
            node {
              ... on Text {
                title
                text
              }
            }
          }
        }
      }
    }
  }
`;

const GET_LEVEL_TWO_COURSE_DATA = gql`
query($uid: String!, $locale: String!) {
  level_2_course(uid: $uid, locale: $locale, fallback_locale: true) {
    system {
      uid
    }
    title
    metadata {
      assessmentConnection {
        edges {
          node {
            ... on Assessments {
              title
              display_title
              activity_points {
                activity_points
              }
              system {
                uid
              }
            }
          }
        }
      }
    }
    enrichment_topicsConnection {
      edges {
        node {
          ... on Level2 {
            title
            metadata {
              display_title
            }
            system {
              uid
            }
          }
        }
      }
    }
    topicsConnection {
      edges {
        node {
          ... on Level2 {
            title
            metadata {
              display_title
            }
            system {
              uid
            }
          }
        }
      }
    }
  }
}
`;

const GET_LEVEL_THREE_COURSE_ENRICHMENT_DATA = gql`
query($uid: String!, $locale: String!) {
  level_3_course(uid: $uid, locale: $locale, fallback_locale: true) {
    system {
      uid
    }
    title
    enrichment_topicsConnection(limit: 70) {
      edges {
        node {
          ... on Level3 {
            title
            system {
              uid
            }
            sub_topicsConnection {
              edges {
                node {
                  ... on Level2 {
                    title
                    metadata {
                      display_title
                    }
                    system {
                      uid
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    metadata {
      assessmentConnection {
        edges {
          node {
            ... on Assessments {
              title
              display_title
              activity_points {
                activity_points
              }
            }
          }
        }
      }
    }
  }
}
`;

const GET_LEVEL_THREE_COURSE_CORE_DATA = gql`
query($uid: String!, $locale: String!) {
  level_3_course(uid: $uid, locale: $locale, fallback_locale: true) {
    system {
      uid
    }
    title
    topicsConnection(limit: 70) {
      edges {
        node {
          ... on Level3 {
            title
            system {
              uid
            }
            sub_topicsConnection {
              edges {
                node {
                  ... on Level2 {
                    title
                    metadata {
                      display_title
                    }
                    system {
                      uid
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    metadata {
      assessmentConnection {
        edges {
          node {
            ... on Assessments {
              title
              display_title
              activity_points {
                activity_points
              }
            }
          }
        }
      }
    }
  }
}
`;


export {
  GET_LEVEL_TWO_COURSE_DATA,
  GET_LEVEL_TWO_COLLECTION_CONTENT,
  GET_LEVEL_TWO_COLLECTION_OUTRO_TEXT,
  GET_LEVEL_THREE_COURSE_ENRICHMENT_DATA,
  GET_LEVEL_THREE_COURSE_CORE_DATA,
};
