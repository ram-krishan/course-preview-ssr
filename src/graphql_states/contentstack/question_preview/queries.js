import gql from 'graphql-tag';

const GET_TOPIC_EXAM_CONTENT = gql`
  query GetTopicExamPreview($examCmsId: String!, $locale: String!) {
    exam(uid: $examCmsId, locale: $locale, fallback_locale: true) {
      title
      duration_minutes
      display_title
      system {
        uid
      }
      imageConnection {
        edges {
          node {
            ... on Image {
              imageConnection {
                edges {
                  node {
                    url
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
      }
    }
  }
`;


const GET_TOPIC_EXAM_QUESTION_CONTENT = gql`
  query GetExamQuestionPreview($questionCmsId: String!, $locale: String!) {
    question(uid: $questionCmsId, locale: $locale, fallback_locale: true) {
      question_type
      question
      system {
        uid
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
`;

export { GET_TOPIC_EXAM_CONTENT, GET_TOPIC_EXAM_QUESTION_CONTENT };
