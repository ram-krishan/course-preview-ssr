import gql from 'graphql-tag';
import { courseFragment } from './fragments';

const GET_LEVEL_TWO_COURSES = gql`
  query ($skip: Int!, $limit: Int!) {
    all_level_2_course(skip: $skip, limit: $limit) {
      items {
        title
        __typename
        system {
          uid
        }
        metadata {
          display_title
        }
      }
      total
    }
  }
`;

const GET_LEVEL_THREE_COURSE_DATA = gql`
query($uid: String!, $locale: String!) {
  level_3_course(uid: $uid, locale: $locale, fallback_locale: true) {
    title
    system {
      uid
    }
    activity_points {
      activity_points
    }
    metadata {
      ...CourseDetails
    }
    enrichment_topicsConnection {
      edges {
        node {
          ... on Level3 {
            title
            __typename
            metadata {
              display_title
              measurement_categoriesConnection(limit: 20) {
                edges {
                  node {
                    ... on MeasurementCategory {
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
    topicsConnection {
      edges {
        node {
          ... on Level3 {
            title
            system {
              uid
            }
            activity_points {
              activity_points
            }
            __typename
            metadata {
              display_title
              measurement_categoriesConnection(limit: 20) {
                edges {
                  node {
                    ... on MeasurementCategory {
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
      }
    }
  }
}
${courseFragment}
`;

const GET_LEVEL_TWO_COURSE_DATA = gql`
  query($uid: String!, $locale: String!) {
    level_2_course(uid: $uid, locale: $locale, fallback_locale: true) {
      title
      system {
        uid
      }
      activity_points {
        activity_points
      }
      metadata {
        ...CourseDetails
      }
      topicsConnection {
        edges {
          node {
            ... on Level2 {
              title
              __typename
              metadata {
                display_title
                measurement_categoriesConnection(limit: 20) {
                  edges {
                    node {
                      ... on MeasurementCategory {
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
      enrichment_topicsConnection {
        edges {
          node {
            ... on Level2 {
              title
              __typename
              metadata {
                display_title
                measurement_categoriesConnection(limit: 20) {
                  edges {
                    node {
                      ... on MeasurementCategory {
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
  }
  ${courseFragment}
`;
const GET_LEVEL_ONE_COLLECTION = gql`
query($uid: String!, $locale: String!) {
  level_1(uid: $uid, locale: $locale, fallback_locale: true) {
    system {
      uid
    }
    activity_points {
      activity_points
    }
    title
    pagesConnection {
      edges {
        node {
          ... on Pagev4 {
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
    metadata {
      measurement_categoriesConnection {
        edges {
          node {
            ... on MeasurementCategory {
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
`;

const GET_LEVEL_TWO_COLLECTION = gql`
  query($uid: String!, $locale: String!) {
    level_2(uid: $uid, locale: $locale, fallback_locale: true) {
      system {
        uid
      }
      activity_points {
        activity_points
      }
      title
      __typename
      examConnection {
        edges {
          node {
            ... on Exam {
              title
              __typename
              display_title
              system {
                uid
              }
              activity_points {
                activity_points
              }
              questionsConnection {
                edges {
                  node {
                    ... on Question {
                      title
                      system {
                        uid
                      }
                      activity_points {
                        activity_points
                      }
                      measurement_categoryConnection {
                        edges {
                          node {
                            ... on MeasurementCategory {
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
              }
            }
          }
        }
        totalCount
      }
      lessonsConnection {
        edges {
          node {
            ... on Level1 {
              title
              __typename
              system {
                uid
              }
              activity_points {
                activity_points
              }
              metadata {
                display_title
                measurement_categoriesConnection(limit: 20) {
                  edges {
                    node {
                      ... on MeasurementCategory {
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
        }
      }
      metadata {
        measurement_categoriesConnection {
          edges {
            node {
              ... on MeasurementCategory {
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
`;

const GET_LEVEL_THREE_COLLECTION = gql`
query($uid: String!, $locale: String!) {
  level_3(uid: $uid, locale: $locale, fallback_locale: true) {
    system {
      uid
    }
    activity_points {
      activity_points
    }
    title
    sub_topicsConnection {
      edges {
        node {
          ... on Level2 {
            title
            system {
              uid
            }
            activity_points {
              activity_points
            }
            __typename
            metadata {
              display_title
              measurement_categoriesConnection(limit: 20) {
                edges {
                  node {
                    ... on MeasurementCategory {
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
      }
    }
    metadata {
      measurement_categoriesConnection {
        edges {
          node {
            ... on MeasurementCategory {
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
`;

const GET_LEVEL_THREE_COURSES = gql`
  query($skip: Int!, $limit: Int!) {
    all_level_3_course(skip: $skip, limit: $limit) {
      items {
        title
        __typename
        system {
          uid
        }
        metadata {
          display_title
        }
      }
      total
    }
  }
`;

const GET_ASSESSMENT_DATA = gql`
  query($uid: String!, $locale: String!) {
    assessments(uid: $uid, locale: $locale, fallback_locale: true) {
      title
      display_title
      examsConnection {
        edges {
          node {
            ... on AssessmentExam {
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
`;

const GET_ASSESSMENT_EXAM_DATA = gql`
  query($uid: String!, $locale: String!) {
    assessment_exam(uid: $uid, locale: $locale, fallback_locale: true) {
      title
      display_title
      system {
        uid
      }
      questionsConnection {
        edges {
          node {
            ... on AssessmentQuestion {
              title
              display_title
              question
              activity_points {
                activity_points
              }
              system {
                uid
              }
              measurement_categoryConnection {
                edges {
                  node {
                    ... on MeasurementCategory {
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
        totalCount
      }
    }
  }
`;

const GET_ASSESSMENT_EXAM_QUESTION_DATA = gql`
  query($uid: String!, $locale: String!) {
    assessment_question(uid: $uid, locale: $locale, fallback_locale: true) {
      title
      question
      system {
        uid
      }
      measurement_categoryConnection {
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
      answersConnection {
        edges {
          node {
            ... on AssessmentAnswer {
              title
              system {
                uid
              }
              answer_option
              answer_weight
            }
          }
        }
      }
    }
  }
`;

const GET_NET_PROMOTER_SCORE_SURVEY_DATA = gql`
  query($uid: String!, $locale: String!) {
    net_promoter_score_survey(uid: $uid, locale: $locale, fallback_locale: true) {
      title
      heading
      low_rating_hint_text
      high_rating_hint_text
      questionConnection {
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
                      value
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

const GET_SENTIMENT_SURVEY_DATA = gql`
  query($uid: String!, $locale: String!) {
    sentiment_survey(uid: $uid, locale: $locale, fallback_locale: true) {
      questionsConnection {
        edges {
          node {
            ... on SurveyQuestion {
              title
              question
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

const GET_SURVEY_QUESTION_DATA = gql`
  query($uid: String!, $locale: String!) {
    survey_question(uid: $uid, locale: $locale, fallback_locale: true) {
      title
      question
      question_answersConnection {
        edges {
          node {
            ... on SurveyAnswer {
              title
              choice_text
              value
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


const GET_QUESTION_DATA = gql`
  query($uid: String!, $locale: String!) {
    question(uid: $uid, locale: $locale, fallback_locale: true) {
      answersConnection {
        edges {
          node {
            ... on Answer {
              title
              system {
                uid
              }
            }
          }
        }
      }
      title
      system {
        uid
      }
      question_type
      question
      measurement_categoryConnection {
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
    }
  }
`;

const GET_PRACTICE_QUESTION_DATA = gql`
  query($uid: String!, $locale: String!) {
    practice_question(uid: $uid, locale: $locale, fallback_locale: true) {
      title
      system {
        uid
      }
      associated_lessonConnection {
        edges {
          node {
            ... on Level1 {
              system {
                uid
              }
            }
          }
        }
      }
      questionConnection {
        edges {
          node {
            ... on Question {
              title
              question_type
              system {
                uid
              }
            }
          }
        }
      }
      confidence_of_responseConnection {
        edges {
          node {
            ... on SurveyQuestion {
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

const GET_LEVEL_TWO_COURSE_TITLE_AND_DISPLAY_TITLE = gql`
  query($cms_id: String!) {
    level_2_course(uid: $cms_id) {
      title
      metadata {
        display_title
      }
    }
  }
`

const GET_LEVEL_THREE_COURSE_TITLE_AND_DISPLAY_TITLE = gql`
  query($cms_id: String!) {
    level_3_course(uid: $cms_id) {
      title
      metadata {
        display_title
      }
    }
  }
`

export {
  GET_LEVEL_TWO_COURSE_TITLE_AND_DISPLAY_TITLE,
  GET_LEVEL_THREE_COURSE_TITLE_AND_DISPLAY_TITLE,
  GET_LEVEL_TWO_COURSES,
  GET_LEVEL_THREE_COURSES,
  GET_LEVEL_TWO_COURSE_DATA,
  GET_LEVEL_TWO_COLLECTION,
  GET_LEVEL_ONE_COLLECTION,
  GET_LEVEL_THREE_COURSE_DATA,
  GET_LEVEL_THREE_COLLECTION,
  GET_ASSESSMENT_DATA,
  GET_ASSESSMENT_EXAM_DATA,
  GET_ASSESSMENT_EXAM_QUESTION_DATA,
  GET_NET_PROMOTER_SCORE_SURVEY_DATA,
  GET_SENTIMENT_SURVEY_DATA,
  GET_SURVEY_QUESTION_DATA,
  GET_QUESTION_DATA,
  GET_PRACTICE_QUESTION_DATA,
};
