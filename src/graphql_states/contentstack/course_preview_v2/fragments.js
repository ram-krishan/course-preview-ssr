import gql from 'graphql-tag';

const courseFragment = gql`
  fragment CourseDetailsV2 on CourseAttributes {
    assessmentConnection {
      edges {
        node {
          ... on Assessments {
            title
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
    senior_leader_messageConnection {
      edges {
        node {
          ... on SeniorLeaderMessage {
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
    sentiment_survey1Connection {
      edges {
        node {
          ... on SentimentSurvey {
            title
            display_title
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
    sentiment_survey2Connection {
      edges {
        node {
          ... on SentimentSurvey {
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
    sentiment_survey3Connection {
      edges {
        node {
          ... on SentimentSurvey {
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
    net_promoter_score_surveyConnection {
      edges {
        node {
          ... on NetPromoterScoreSurvey {
            title
            display_title
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
    learning_resourcesConnection {
      edges {
        node {
          ... on LearningResource {
            title
            display_title
            system{
              uid
            }
          }
        }
      }
    }
    quickcheck_taxonomyConnection {
      edges {
        node {
          ... on TaxonBottomUp {
            title
            display_name
            system {
              uid
            }
          }
        }
      }
    }
    course_description
    duration
  }
`;

export {
  courseFragment,
};
