import gql from 'graphql-tag';
import { courseFragment } from './fragments';

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
      ...CourseDetailsV2
    }
    level3_enrichment_topicsConnection: enrichment_topicsConnection {
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
    level3_topicsConnection: topicsConnection {
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
        ...CourseDetailsV2
      }
      topicsConnection {
        edges {
          node {
            ... on Level2 {
              title
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

const GET_TAXONOMY_CHILDRENS = gql`
  query($parentUid: String!) {
    all_taxon_bottom_up(
      where: {parent_taxonomy: {taxon_bottom_up: {uid: $parentUid}}}
    ) {
      total
      items {
        display_name
        system {
          uid
        }
      }
    }
  }
`;

const GET_QUICK_CHECK_QUESTION_ITEMS = gql`
  query($uid: [String!], $locale: String!) {
    all_questionitem(
      locale: $locale
      fallback_locale: true
      where: {topic: {taxon_bottom_up: {uid_in: $uid}}}
    ) {
      items {
        title
        topicConnection {
          edges {
            node {
              ... on TaxonBottomUp {
                title
                display_name
              }
            }
          }
        }
        system {
          uid
        }
      }
    }
  }
`;

const GET_ASSESSMENT_DATA = gql`
  query($uid: String!, $locale: String!) {
    assessments(uid: $uid, locale: $locale, fallback_locale: true) {
      examsConnection {
        edges {
          node {
            ... on AssessmentExam {
              title
              display_title
              system {
                uid
              }
              activity_points {
                activity_points
              }
              questionsConnection(limit: 20) {
                edges {
                  node {
                    ... on AssessmentQuestion {
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

const GET_ASSESSMENT_EXAM_DATA = gql`
  query($uid: String!, $locale: String!) {
    assessment_exam(uid: $uid, locale: $locale, fallback_locale: true) {
      questionsConnection {
        edges {
          node {
            ... on AssessmentQuestion {
              title
              display_title
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
      }
    }
  }
`;


const GET_LEVEL_THREE_COLLECTION_DATA =  gql`
  query($uid: String!, $locale: String!) {
    level_3(uid: $uid, locale: $locale, fallback_locale: true) {
      sub_topicsConnection {
        edges {
          node {
            ... on Level2 {
              title
              metadata {
                display_title
                measurement_categoriesConnection(limit: 10) {
                  edges {
                    node {
                      ... on MeasurementCategory {
                        title
                        display_title
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
              lessonsConnection(limit: 50) {
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
              examConnection {
                edges {
                  node {
                    ... on Exam {
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

const GET_LEVEL_TWO_COLLECTION_DATA =  gql`
  query($uid: String!, $locale: String!) {
    level_2(uid: $uid, locale: $locale, fallback_locale: true) {
      lessonsConnection {
        edges {
          node {
            ... on Level1 {
              title
              metadata {
                display_title
                measurement_categoriesConnection(limit: 10) {
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
              pagesConnection(limit: 50) {
                edges {
                  node {
                    ... on Pagev4 {
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
      examConnection {
        edges {
          node {
            ... on Exam {
              title
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

const GET_LEVEL_ONE_COLLECTION_DATA =  gql`
  query($uid: String!, $locale: String!) {
    level_1(uid: $uid, locale: $locale, fallback_locale: true) {
      pagesConnection {
        edges {
          node {
            ... on Pagev4 {
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
`;

const GET_LEVEL_TWO_EXAM_DATA = gql`
  query($uid: String!, $locale: String!) {
    exam(uid: $uid, locale: $locale, fallback_locale: true) {
      questionsConnection {
        edges {
          node {
            ... on Question {
              title
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

const GET_COURSES = gql`
  query {
    all_level_2_course(limit: 100) {
      items {
        __typename
        system {
          uid
        }
        title
        metadata {
          display_title
        }
      }
    }
    all_level_3_course(limit: 100) {
      items {
        __typename
        system {
          uid
        }
        title
        metadata {
          display_title
        }
      }
    }
  }
`;

export {
  GET_LEVEL_TWO_COURSE_DATA,
  GET_LEVEL_THREE_COURSE_DATA,
  GET_ASSESSMENT_DATA,
  GET_ASSESSMENT_EXAM_DATA,
  GET_LEVEL_THREE_COLLECTION_DATA,
  GET_LEVEL_TWO_COLLECTION_DATA,
  GET_LEVEL_ONE_COLLECTION_DATA,
  GET_LEVEL_TWO_EXAM_DATA,
  GET_QUICK_CHECK_QUESTION_ITEMS,
  GET_TAXONOMY_CHILDRENS,
  GET_COURSES
};
