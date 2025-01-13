import gql from 'graphql-tag';
import { ImageAssociatedContentCardReferenceFragment } from '../lesson/fragments';

const GET_SENIOR_LEADER_MESSAGE = gql`
  query contentstackSeniorLeaderMessage(
    $vibCourseId: ID!
  ) {
    contentstackSeniorLeaderMessage(vibCourseId: $vibCourseId) {
      id
      title
      header
      seniorLeaderMessageContents {
        __typename
        ... on SeniorLeaderMessageTextContent {
          richText
        }
        ... on SeniorLeaderMessageVideoContent {
          video {
            id
            fileUrl
            title
            contentType
            thumbnailUrl
            subtitles {
              id
              language
              label
              url
            }
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
          }
        }
      }
    }
    contentstackCourse(vibCourseId: $vibCourseId){
      id
      title
      isUserAllowToTakeSeniorLeaderMessage
      courseGoals{
        id
        goal {
          id
          title
        }
      }
      selectedGoals {
        id
        title
      }
      userSentimentSurveyProgress {
        id
        status
      }
      courseFeatureList {
        id
        sentimentSurvey1
        sentimentSurvey2
        sentimentSurvey3
      }
    }
  }
  ${ImageAssociatedContentCardReferenceFragment}
`;

export {
  GET_SENIOR_LEADER_MESSAGE,
};
