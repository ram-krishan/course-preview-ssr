import gql from 'graphql-tag';

const GET_LEVEL_TWO_COURSE_TAXONOMY_CONNECTION_DATA = gql`
  query GetLevelTwoTaxonomyConnectionData ($courseCmsId: String!, $locale: String!) {
    level_2_course(uid: $courseCmsId, locale: $locale, fallback_locale: true) {
      metadata {
        quickcheck_taxonomyConnection {
          edges {
            node {
              ... on TaxonBottomUp {
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

const GET_LEVEL_THREE_COURSE_TAXONOMY_CONNECTION_DATA = gql`
  query GetLevelThreeTaxonomyConnectionData($courseCmsId: String!, $locale: String!) {
    level_3_course(uid: $courseCmsId, locale: $locale, fallback_locale: true) {
      metadata {
        quickcheck_taxonomyConnection {
          edges {
            node {
              ... on TaxonBottomUp {
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



const GET_ALL_QUICK_CHECK_QUESTION_ITEM_DATA = gql`
  query GetAllQuickCheckQuestionItemData($quickCheckQuestioItemIds: [String!], $locale: String!) {
    all_questionitem(
      where: {topic: {taxon_bottom_up: {uid_in: $quickCheckQuestioItemIds}}}
      locale: $locale
      fallback_locale: true
    ) {
      items {
        title
        topicConnection {
          edges {
            node {
              ... on TaxonBottomUp {
                title
                display_name
                parent_taxonomyConnection {
                  edges {
                    node {
                      ... on TaxonBottomUp {
                        title
                        display_name
                      }
                    }
                  }
                }
              }
            }
          }
        }
        variants {
          ... on QuestionitemVariantsMcquestion {
            __typename
            mcquestion {
              choices {
                ... on QuestionitemVariantsMcquestionBlockChoicesChoice {
                  __typename
                  choice {
                    body
                    correct
                    feedback
                  }
                }
              }
              stem
            }
          }
        }
      }
    }
  }
`;



export { 
  GET_ALL_QUICK_CHECK_QUESTION_ITEM_DATA,
  GET_LEVEL_TWO_COURSE_TAXONOMY_CONNECTION_DATA,
  GET_LEVEL_THREE_COURSE_TAXONOMY_CONNECTION_DATA,
};
