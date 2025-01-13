import gql from 'graphql-tag';

const GET_PRACTICE_QUESTION_DATA = gql`
  query GetPracticeQuestionPreview($practiceQuestionCmsId: String!, $locale: String!) {
    practice_question(uid: $practiceQuestionCmsId, locale: $locale, fallback_locale: true) {
      system {
        uid
      }
      title
      questionConnection {
        edges {
          node {
            ... on Question {
              title
              question_type
              system {
                uid
              }
              question
              scenario {
                ... on QuestionScenarioVideoScenario {
                  __typename
                  video_scenario {
                    videoConnection {
                      edges {
                        node {
                          ... on Video {
                            title
                            system {
                              uid
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
                  }
                }
              }
              answersConnection {
                edges {
                  node {
                    ... on Answer {
                      title
                      display_text
                      is_correct_response
                      explanation
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
      confidence_of_responseConnection {
        edges {
          node {
            ... on SurveyQuestion {
              title
              question
              system {
                uid
              }
              question_answersConnection {
                edges {
                  node {
                    ... on SurveyAnswer {
                      title
                      choice_text
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
    }
  }
`;

export { GET_PRACTICE_QUESTION_DATA };
