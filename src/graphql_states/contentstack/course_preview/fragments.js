import gql from 'graphql-tag';

const courseFragment = gql`
  fragment CourseDetails on CourseAttributes {
    assessmentConnection {
      edges {
        node {
          ... on Assessments {
            title
            __typename
            display_title
            system {
              uid
            }
            activity_points {
              activity_points
            }
            examsConnection {
              edges {
                node {
                  ... on AssessmentExam {
                    __typename
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
        }
      }
    }
    sentiment_survey1Connection {
      edges {
        node {
          ... on SentimentSurvey {
            title
            system {
              uid
              updated_at
              version
            }
            activity_points {
              activity_points
            }
          }
        }
      }
    }
    sentiment_survey2Connection {
      edges {
        node {
          ... on SentimentSurvey {
            title
            system {
              uid
              updated_at
              version
            }
            activity_points {
              activity_points
            }
          }
        }
      }
    }
    sentiment_survey3Connection {
      edges {
        node {
          ... on SentimentSurvey {
            title
            system {
              uid
              updated_by
              version
            }
            activity_points {
              activity_points
            }
          }
        }
      }
    }
    net_promoter_score_surveyConnection {
      edges {
        node {
          ... on NetPromoterScoreSurvey {
            title
            system {
              uid
              updated_at
              version
            }
            activity_points {
              activity_points
            }
          }
        }
      }
    }
    goalsConnection {
      edges {
        node {
          ... on Goals {
            title
            coaching_prompt
            display_title
            system {
              uid
            }
          }
        }
      }
    }
    measurement_categoriesConnection {
      edges {
        node {
          ... on MeasurementCategory {
            title
            system {
              uid
            }
          }
        }
      }
    }
    senior_leader_messageConnection {
      edges {
        node {
          ... on SeniorLeaderMessage {
            title
            header
            system {
              uid
            }
            activity_points {
              activity_points
            }
          }
        }
      }
    }
    practice_questionsConnection {
      edges {
        node {
          ... on PracticeQuestion {
            title
            system {
              uid
            }
            activity_points {
              activity_points
            }
          }
        }
      }
    }
  }
`;

export {
  courseFragment,
};
