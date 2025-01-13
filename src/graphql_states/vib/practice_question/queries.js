import gql from 'graphql-tag';
import { ImageAssociatedContentCardReferenceFragment } from '../lesson/fragments';


const GET_COURSE_PRACTICE_MEASUREMENT_CATEGORIES = gql`
  query coursePracticeMeasurementCategories {
    coursePracticeMeasurementCategories {
      id
      title
      colorCode
      practiceQuestionCount
      __typename
    }
  }
`;

const GET_USER_COURSE_PRACTICE = gql`
  query vibUserCoursePractice($userCoursePracticeId: ID!, $locale: String!) {
    vibUserCoursePractice(userCoursePracticeId: $userCoursePracticeId, locale: $locale,fallback_locale: true) {
      id
      streakCount
      sessionCount
      totalActivityPointsForCompleteSessions
      totalActivityCorrectQuestionCountForCompleteSessions
      totalActivityIncorrectQuestionCountForCompleteSessions
      leaderBoardDetails {
        id
        streakCount
        user {
          id
          fullName
        }
      }
    }
  }
`;

const GET_PRACTICE_QUESTION_MEASUREMENT_CATEGORY_AND_USER_COURSE_PRACTICE = gql`
  query practiceQuestionMeasurementCategory(
    $vibMeasurementCategoryId: ID!
    $vibCourseId: ID!
    $userCoursePracticeId: ID!, $locale: String!
  ) {
    practiceQuestionMeasurementCategory(vibMeasurementCategoryId: $vibMeasurementCategoryId, locale: $locale, fallback_locale: true) {
      id
      title
      practiceQuestions(vibCourseId: $vibCourseId, locale: $locale, fallback_locale: true) {
        id
        question {
          id
          question
          isMultipleChoiceQuestion
          isValid
          isTextOrVedioPresent
          explanation
          video {
            id
            fileUrl
            thumbnailUrl
            title
            contentType
            showAssociatedContent
            associatedContentPosition
            associatedContentWidth
            associatedContent {
              type
              ... on CardReference {
                ... ImageAssociatedContentCardReferenceFragment
              }
              ... on InlineText {
                text
              }
              ... on TextReference {
                text
                emphasis
              }
              ... on QuoteReference {
                text
                attribution
              }
              ... on TestimonialReference {
                text
                authors{
                  authorName
                }
              }
              ... on TipReference {
                text
                emphasis
              }
              ... on ImageReference {
                url
                title
                showAssociatedText
                associatedText
                associatedTextPosition
                associatedTextWidth
              }
              ... on VideoReference {
                video {
                  id
                  fileUrl
                  title
                  thumbnailUrl
                  contentType
                  subtitles {
                    id
                    title
                    language
                    label
                    url
                  }
                }
                showAssociatedText
                associatedText
                associatedTextPosition
                associatedTextWidth
              }
              ... on LearningResource {
                title
                url
              }
            }
            subtitles {
              id
              label
              language
              url
            }
          }
          text {
            text
            title
          }
          answers {
            id
            answer
            explanation
            isCorrectResponse
          }
        }
        confidenceOfResponse {
          id
          question
          surveyAnswers {
            id
            title
            choiceText
          }
        }
      }
    }
    vibUserCoursePractice(userCoursePracticeId: $userCoursePracticeId) {
      id
      streakCount
      totalActivityPointsForCompleteSessions
      totalActivityPoints
      user {
        id
      }
    }
  }
  ${ImageAssociatedContentCardReferenceFragment}
`;

const GET_ALL_PRACTICE_QUESTION_MEASUREMENT_CATEGORIES_AND_USER_COURSE_PRACTICE = gql`
  query allPracticeQuestionMeasurementCategories(
    $vibCourseId: ID!
    $userCoursePracticeId: ID!, $locale: String!
  ) {
    allPracticeQuestionMeasurementCategories(vibCourseId: $vibCourseId, locale: $locale, fallback_locale: true) {
      id
      title
      practiceQuestions(vibCourseId: $vibCourseId, locale: $locale, fallback_locale: true) {
        id
        question {
          id
          question
          isMultipleChoiceQuestion
          isValid
          isTextOrVedioPresent
          explanation
          video {
            id
            fileUrl
            thumbnailUrl
            title
            contentType
            showAssociatedContent
            associatedContentPosition
            associatedContentWidth
            associatedContent {
              type
              ... on CardReference {
                ... ImageAssociatedContentCardReferenceFragment
              }
              ... on InlineText {
                text
              }
              ... on TextReference {
                text
                emphasis
              }
              ... on QuoteReference {
                text
                attribution
              }
              ... on TestimonialReference {
                text
                authors{
                  authorName
                }
              }
              ... on TipReference {
                text
                emphasis
              }
              ... on ImageReference {
                url
                title
                showAssociatedText
                associatedText
                associatedTextPosition
                associatedTextWidth
              }
              ... on VideoReference {
                video {
                  id
                  fileUrl
                  title
                  thumbnailUrl
                  contentType
                  subtitles {
                    id
                    title
                    language
                    label
                    url
                  }
                }
                showAssociatedText
                associatedText
                associatedTextPosition
                associatedTextWidth
              }
              ... on LearningResource {
                title
                url
              }
            }
            subtitles {
              id
              label
              language
              url
            }
          }
          text {
            text
            title
          }
          answers {
            id
            answer
            explanation
            isCorrectResponse
          }
        }
        confidenceOfResponse {
          id
          question
          surveyAnswers {
            id
            title
            choiceText
          }
        }
      }
    }
    vibUserCoursePractice(userCoursePracticeId: $userCoursePracticeId) {
      id
      streakCount
      totalActivityPointsForCompleteSessions
      totalActivityPoints
      user {
        id
      }
    }
  }
  ${ImageAssociatedContentCardReferenceFragment}
`;

export {
  GET_COURSE_PRACTICE_MEASUREMENT_CATEGORIES,
  GET_USER_COURSE_PRACTICE,
  GET_PRACTICE_QUESTION_MEASUREMENT_CATEGORY_AND_USER_COURSE_PRACTICE,
  GET_ALL_PRACTICE_QUESTION_MEASUREMENT_CATEGORIES_AND_USER_COURSE_PRACTICE,
};
