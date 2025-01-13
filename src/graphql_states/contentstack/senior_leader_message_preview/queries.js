import gql from 'graphql-tag';

const GET_SENIOR_LEADER_MESSAGE_CONTENT = gql`
  query GetSLMPreview($seniorLeaderMessageCmsId: String!, $locale: String!) {
    senior_leader_message(uid: $seniorLeaderMessageCmsId, locale: $locale, fallback_locale: true) {
      system {
        uid
      }
      modular_blocks {
        ... on SeniorLeaderMessageModularBlocksText {
          __typename
          text {
            textConnection {
              edges {
                node {
                  ... on Text {
                    text
                    title
                  }
                }
              }
            }
          }
        }
        ... on SeniorLeaderMessageModularBlocksVideo {
          __typename
          video {
            videoConnection {
              edges {
                node {
                  ... on Video {
                    title
                    system {
                      uid
                    }
                    show_associated_content_
                    associated_content {
                      components {
                        ... on PageComponentsComponentsTextReference {
                          __typename
                          text_reference {
                            textConnection {
                              edges {
                                node {
                                  ... on Text {
                                    text
                                    emphasis {
                                      emphasis_selection
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        ... on PageComponentsComponentsInlineText {
                          __typename
                          inline_text {
                            text
                          }
                        }
                      }
                    }
                    videoConnection {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                    preview_imageConnection {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                    subtitlesConnection {
                      edges {
                        node {
                          ... on Subtitles {
                            title
                            system {
                              uid
                              locale
                            }
                            fileConnection {
                              edges {
                                node {
                                  url
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_LEVEL_TWO_COURSE_GOALS = gql`
  query GetL2CourseGoalsPreview($courseId: String!, $locale: String!) {
    level_2_course(uid:$courseId , locale: $locale, fallback_locale: true) {
      title
      metadata {
        display_title
        goalsConnection {
          edges {
            node {
              ... on Goals {
                title
                display_title
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
`
const GET_LEVEL_THREE_COURSE_GOALS = gql`
  query GetL3CourseGoalsPreview($courseId: String!, $locale: String!) {
    level_3_course(uid: $courseId, locale: $locale, fallback_locale: true) {
      title
      metadata {
        display_title
        goalsConnection {
          edges {
            node {
              ... on Goals {
                title
                display_title
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
`

export {
  GET_SENIOR_LEADER_MESSAGE_CONTENT,
  GET_LEVEL_TWO_COURSE_GOALS,
  GET_LEVEL_THREE_COURSE_GOALS,
};