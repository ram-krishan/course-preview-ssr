import gql from 'graphql-tag';
import { examUserProgressDetailsFragment } from './fragments';
import { ImageAssociatedContentCardReferenceFragment } from '../lesson/fragments';


const GET_LEVEL_TWO_COLLECTION_PROGRESS = gql`
  query levelTwoCollectionProgress($levelTwoCollectionCourseId: ID!) {
    levelTwoCollectionProgress(
      levelTwoCollectionCourseId: $levelTwoCollectionCourseId
    ) {
      id
      nextLearnPath
      contentType
      levelTwoCollectionCourse {
        id
        levelTwoCourse {
          id
          title
        }
        levelTwoCollection {
          id
          title
          levelTwoLevelOneCollections {
            id
            position
            levelOneCollection{
              id
              title
            }
          }
          exam {
            id
            title
            duration
            image {
              id
              url
              title
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
            totalQuestions
            examQuestions {
              id
              position
              question {
                id
                question
                questionType
                answers {
                  id
                  answer
                  isCorrectResponse
                  explanation
                }
              }
            }
          }
        }
      }
      levelTwoCollectionExamUserProgress {
        ...ExamUserProgressDetails
      }
    }
  }
  ${ImageAssociatedContentCardReferenceFragment}
  ${examUserProgressDetailsFragment}
`;

const GET_LEVEL_THREE_COLLECTION_PROGRESS = gql`
  query levelThreeCollectionProgress(
    $levelThreeCollectionCourseId: ID!
    $levelThreeLevelTwoCollectionId: ID!
  ) {
    levelThreeCollectionProgress(
      levelThreeCollectionCourseId: $levelThreeCollectionCourseId,
      levelThreeLevelTwoCollectionId: $levelThreeLevelTwoCollectionId
    ){
      id
      nextLearnPath(levelThreeLevelTwoCollectionId: $levelThreeLevelTwoCollectionId)
      levelTwoCollectionExamUserProgress(levelThreeLevelTwoCollectionId: $levelThreeLevelTwoCollectionId) {
        ...ExamUserProgressDetails
      }
      levelThreeCollectionCourse {
        id
        levelThreeCourse {
          id
          title
          course{
            id
          }
        }
      }
      levelThreeCollection {
        id
        title
        levelThreeLevelTwoCollection(
          levelThreeLevelTwoCollectionId: $levelThreeLevelTwoCollectionId
        ) {
          id
          position
          levelTwoCollection {
            id
            title
            levelTwoLevelOneCollections {
              id
              position
              levelOneCollection{
                id
                title
              }
            }
            exam {
              id
              title
              duration
              image {
                id
                url
                title
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
              totalQuestions
              examQuestions {
                id
                position
                question {
                  id
                  question
                  questionType
                  answers {
                    id
                    answer
                    isCorrectResponse
                    explanation
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${ImageAssociatedContentCardReferenceFragment}
  ${examUserProgressDetailsFragment}
`;

export {
  GET_LEVEL_TWO_COLLECTION_PROGRESS,
  GET_LEVEL_THREE_COLLECTION_PROGRESS,
};
