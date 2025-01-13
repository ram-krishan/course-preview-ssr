import gql from 'graphql-tag';


const GET_LEVEL_TWO_LEARNING_RESOURCE_DATA = gql`
  query GetApplyPagePreviewData($courseCmsId: String!, $locale: String!) {
    level_2_course(uid: $courseCmsId, locale: $locale, fallback_locale: true) {
      metadata {
        display_title
        learning_resourcesConnection {
          edges {
            node {
              ... on LearningResource {
                title
                display_title
                resourceConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
                descriptionConnection {
                  edges {
                    node {
                      ... on Text {
                        text
                      }
                    }
                  }
                }
                imageConnection {
                  edges {
                    node {
                      ... on Image {
                        title
                        imageConnection {
                          edges {
                            node {
                              url
                              system {
                                branch
                                created_at
                                updated_at
                                created_by
                                updated_by
                                uid
                                version
                                content_type_uid
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                title
                display_title
                system {
                  created_at
                  created_by
                  locale
                  uid
                  updated_at
                  updated_by
                  version
                }
              }
            }
          }
        }
      }
    title
    }
  }
`;

const GET_LEVEL_THREE_LEARNING_RESOURCE_DATA = gql`
  query GetApplyPagePreviewData($courseCmsId: String!, $locale: String!) {
    level_3_course(uid: $courseCmsId, locale: $locale, fallback_locale: true) {
      metadata {
        display_title
        learning_resourcesConnection {
          edges {
            node {
              ... on LearningResource {
                title
                display_title
                resourceConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
                descriptionConnection {
                  edges {
                    node {
                      ... on Text {
                        text
                      }
                    }
                  }
                }
                imageConnection {
                  edges {
                    node {
                      ... on Image {
                        title
                        imageConnection {
                          edges {
                            node {
                              url
                              system {
                                branch
                                created_at
                                updated_at
                                created_by
                                updated_by
                                uid
                                version
                                content_type_uid
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                title
                display_title
                system {
                  created_at
                  created_by
                  locale
                  uid
                  updated_at
                  updated_by
                  version
                }
              }
            }
          }
        }
      }
    title
    }
  }
`;

export {
  GET_LEVEL_TWO_LEARNING_RESOURCE_DATA,
  GET_LEVEL_THREE_LEARNING_RESOURCE_DATA,
};
