import gql from 'graphql-tag';
import { PageCardReferenceFragment } from './fragments';

const GET_PAGE = gql`
query pageProgress(
  $pageProgressId: ID!
  $shouldUpdateStatus: Boolean
) {
  pageProgress(pageProgressId: $pageProgressId, shouldUpdateStatus: $shouldUpdateStatus) {
    id
    previousPageProgressId
    perviousLevelOneCollectionUrl
    parentLevelTwoCollectionUrl
    previousLevelTwoCollection{
      id
      title
    }
    page {
      id
      title
      cmsId
      pageContent {
        id
        topConnectiveTissue{
          id
          content {
            type
            ... on CardReference {
              ... PageCardReferenceFragment
            }
            ... on InlineText {
              text
            }
            ... on TextReference {
              text
              emphasis
            }
            ... on QuestionReference {
              question {
                id
                question
                questionType
                explanation
                submittedAnswers(pageProgressId: $pageProgressId){
                  id
                }
                isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                answers {
                  id
                  answer
                  isCorrectResponse
                  explanation
                }
              }
            }
            ... on SurveyQuestionReference {
              surveyQuestion {
                id
                question
                submittedAnswer(pageProgressId: $pageProgressId){
                  id
                }
                surveyAnswers{
                  id
                  choiceText
                  value
                }
              }
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
              showAssociatedContent
              associatedContentPosition
              associatedContentWidth
              associatedContent {
                type
                ... on CardReference {
                  ... PageCardReferenceFragment
                }
                ... on InlineText {
                  text
                }
                ... on TextReference {
                  text
                  emphasis
                }
                ... on QuestionReference {
                  question {
                    id
                    question
                    questionType
                    explanation
                    submittedAnswers(pageProgressId: $pageProgressId){
                      id
                    }
                    isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                    answers {
                      id
                      answer
                      isCorrectResponse
                      explanation
                    }
                  }
                }
                ... on SurveyQuestionReference {
                  surveyQuestion {
                    id
                    question
                    submittedAnswer(pageProgressId: $pageProgressId){
                      id
                    }
                    surveyAnswers{
                      id
                      choiceText
                      value
                    }
                  }
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
            ... on VideoReference {
              video {
                id
                fileUrl
                title
                thumbnailUrl
                contentType
                showAssociatedContent
                associatedContentPosition
                associatedContentWidth
                associatedContent {
                  type
                  ... on CardReference {
                    ... PageCardReferenceFragment
                  }
                  ... on InlineText {
                    text
                  }
                  ... on TextReference {
                    text
                    emphasis
                  }
                  ... on QuestionReference {
                    question {
                      id
                      question
                      questionType
                      explanation
                      submittedAnswers(pageProgressId: $pageProgressId){
                        id
                      }
                      isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                      answers {
                        id
                        answer
                        isCorrectResponse
                        explanation
                      }
                    }
                  }
                  ... on SurveyQuestionReference {
                    surveyQuestion {
                      id
                      question
                      submittedAnswer(pageProgressId: $pageProgressId){
                        id
                      }
                      surveyAnswers{
                        id
                        choiceText
                        value
                      }
                    }
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
        bottomConnectiveTissue{
          id
          content {
            type
            ... on CardReference {
              ... PageCardReferenceFragment
            }
            ... on InlineText {
              text
            }
            ... on TextReference {
              text
              emphasis
            }
            ... on QuestionReference {
              question {
                id
                question
                questionType
                explanation
                submittedAnswers(pageProgressId: $pageProgressId){
                  id
                }
                isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                answers {
                  id
                  answer
                  isCorrectResponse
                  explanation
                }
              }
            }
            ... on SurveyQuestionReference {
              surveyQuestion {
                id
                question
                submittedAnswer(pageProgressId: $pageProgressId){
                  id
                }
                surveyAnswers{
                  id
                  choiceText
                  value
                }
              }
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
              showAssociatedContent
              associatedContentPosition
              associatedContentWidth
              associatedContent {
                type
                ... on CardReference {
                  ... PageCardReferenceFragment
                }
                ... on InlineText {
                  text
                }
                ... on TextReference {
                  text
                  emphasis
                }
                ... on QuestionReference {
                  question {
                    id
                    question
                    questionType
                    explanation
                    submittedAnswers(pageProgressId: $pageProgressId){
                      id
                    }
                    isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                    answers {
                      id
                      answer
                      isCorrectResponse
                      explanation
                    }
                  }
                }
                ... on SurveyQuestionReference {
                  surveyQuestion {
                    id
                    question
                    submittedAnswer(pageProgressId: $pageProgressId){
                      id
                    }
                    surveyAnswers{
                      id
                      choiceText
                      value
                    }
                  }
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
            ... on VideoReference {
              video {
                id
                fileUrl
                title
                thumbnailUrl
                contentType
                showAssociatedContent
                associatedContentPosition
                associatedContentWidth
                associatedContent {
                  type
                  ... on CardReference {
                    ... PageCardReferenceFragment
                  }
                  ... on InlineText {
                    text
                  }
                  ... on TextReference {
                    text
                    emphasis
                  }
                  ... on QuestionReference {
                    question {
                      id
                      question
                      questionType
                      explanation
                      submittedAnswers(pageProgressId: $pageProgressId){
                        id
                      }
                      isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                      answers {
                        id
                        answer
                        isCorrectResponse
                        explanation
                      }
                    }
                  }
                  ... on SurveyQuestionReference {
                    surveyQuestion {
                      id
                      question
                      submittedAnswer(pageProgressId: $pageProgressId){
                        id
                      }
                      surveyAnswers{
                        id
                        choiceText
                        value
                      }
                    }
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
        showSecondaryContent
        secondaryContentPosition {
          width
          position
        }
        mainContent {
          type
          ... on CardReference {
            ... PageCardReferenceFragment
          }
          ... on InlineText {
            text
          }
          ... on TextReference {
            text
            emphasis
          }
          ... on QuestionReference {
            question {
              id
              question
              questionType
              explanation
              submittedAnswers(pageProgressId: $pageProgressId){
                id
              }
              isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
              answers {
                id
                answer
                isCorrectResponse
                explanation
              }
            }
          }
          ... on SurveyQuestionReference {
            surveyQuestion {
              id
              question
              submittedAnswer(pageProgressId: $pageProgressId){
                id
              }
              surveyAnswers{
                id
                choiceText
                value
              }
            }
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
            showAssociatedContent
            associatedContentPosition
            associatedContentWidth
            associatedContent {
              type
              ... on CardReference {
                ... PageCardReferenceFragment
              }
              ... on InlineText {
                text
              }
              ... on TextReference {
                text
                emphasis
              }
              ... on QuestionReference {
                question {
                  id
                  question
                  questionType
                  explanation
                  submittedAnswers(pageProgressId: $pageProgressId){
                    id
                  }
                  isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                  answers {
                    id
                    answer
                    isCorrectResponse
                    explanation
                  }
                }
              }
              ... on SurveyQuestionReference {
                surveyQuestion {
                  id
                  question
                  submittedAnswer(pageProgressId: $pageProgressId){
                    id
                  }
                  surveyAnswers{
                    id
                    choiceText
                    value
                  }
                }
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
          ... on VideoReference {
            video {
              id
              fileUrl
              title
              thumbnailUrl
              contentType
              showAssociatedContent
              associatedContentPosition
              associatedContentWidth
              associatedContent {
                type
                ... on CardReference {
                  ... PageCardReferenceFragment
                }
                ... on InlineText {
                  text
                }
                ... on TextReference {
                  text
                  emphasis
                }
                ... on QuestionReference {
                  question {
                    id
                    question
                    questionType
                    explanation
                    submittedAnswers(pageProgressId: $pageProgressId){
                      id
                    }
                    isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                    answers {
                      id
                      answer
                      isCorrectResponse
                      explanation
                    }
                  }
                }
                ... on SurveyQuestionReference {
                  surveyQuestion {
                    id
                    question
                    submittedAnswer(pageProgressId: $pageProgressId){
                      id
                    }
                    surveyAnswers{
                      id
                      choiceText
                      value
                    }
                  }
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
        secondaryContent {
          type
          ... on CardReference {
            ... PageCardReferenceFragment
          }
          ... on InlineText {
            text
          }
          ... on TextReference {
            text
            emphasis
          }
          ... on QuestionReference {
            question {
              id
              question
              questionType
              explanation
              submittedAnswers(pageProgressId: $pageProgressId){
                id
              }
              isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
              answers {
                id
                answer
                isCorrectResponse
                explanation
              }
            }
          }
          ... on SurveyQuestionReference {
            surveyQuestion {
              id
              question
              submittedAnswer(pageProgressId: $pageProgressId){
                id
              }
              surveyAnswers{
                id
                choiceText
                value
              }
            }
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
            showAssociatedContent
            associatedContentPosition
            associatedContentWidth
            associatedContent {
              type
              ... on CardReference {
                ... PageCardReferenceFragment
              }
              ... on InlineText {
                text
              }
              ... on TextReference {
                text
                emphasis
              }
              ... on QuestionReference {
                question {
                  id
                  question
                  questionType
                  explanation
                  submittedAnswers(pageProgressId: $pageProgressId){
                    id
                  }
                  isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                  answers {
                    id
                    answer
                    isCorrectResponse
                    explanation
                  }
                }
              }
              ... on SurveyQuestionReference {
                surveyQuestion {
                  id
                  question
                  submittedAnswer(pageProgressId: $pageProgressId){
                    id
                  }
                  surveyAnswers{
                    id
                    choiceText
                    value
                  }
                }
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
          ... on VideoReference {
            video {
              id
              fileUrl
              title
              contentType
              thumbnailUrl
              showAssociatedContent
              associatedContentPosition
              associatedContentWidth
              associatedContent {
                type
                ... on CardReference {
                  ... PageCardReferenceFragment
                }
                ... on InlineText {
                  text
                }
                ... on TextReference {
                  text
                  emphasis
                }
                ... on QuestionReference {
                  question {
                    id
                    question
                    questionType
                    explanation
                    submittedAnswers(pageProgressId: $pageProgressId){
                      id
                    }
                    isOldSubmittedAnswerChanged(pageProgressId: $pageProgressId)
                    answers {
                      id
                      answer
                      isCorrectResponse
                      explanation
                    }
                  }
                }
                ... on SurveyQuestionReference {
                  surveyQuestion {
                    id
                    question
                    submittedAnswer(pageProgressId: $pageProgressId){
                      id
                    }
                    surveyAnswers{
                      id
                      choiceText
                      value
                    }
                  }
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
${PageCardReferenceFragment}
`;

const GET_LEVEL_TWO_LEVEL_ONE_COLLECTION = gql`
query vibLevelTwoLevelOneCollection(
  $vibCourseId: ID!
  $vibLevelTwoLevelOneCollectionId: ID!
  $levelTwoCollectionProgressId: ID!
) {
  cmsCourse(vibCourseId: $vibCourseId){
    id
    title
    levelCourse {
      id
      type
      ...on LevelTwoCourse {
        levelTwoCollectionCount
        currentLevelTwoCollectionCount
      }
      ...on LevelThreeCourse {
        levelTwoCollectionCount
        currentLevelTwoCollectionCount
      }
    }
  }
  vibLevelTwoLevelOneCollection(vibCourseId: $vibCourseId, vibLevelTwoLevelOneCollectionId: $vibLevelTwoLevelOneCollectionId){
    id
    position
    levelTwoCollection(vibCourseId: $vibCourseId)
    {
      id
      title
      levelOneCollectionCount
      exam {
        id
        title
      }
      levelTwoLevelOneCollections {
        id
        position
        levelOneCollection{
          id
          title
          cmsId
          levelOneCollectionProgress(levelTwoCollectionProgressId: $levelTwoCollectionProgressId){
            id
            status
          }
        }
      }
      levelTwoCollectionProgress(levelTwoCollectionProgressId: $levelTwoCollectionProgressId){
        id
        status
        parent{
          id
        }
        contentType
        nextLevelTwoCollection {
          id
          title
        }
      }
      levelOneCollections{
        id
        title
        cmsId
        levelOneCollectionProgress(levelTwoCollectionProgressId: $levelTwoCollectionProgressId) {
          id
          status
        }
      }
    }
    levelOneCollection{
      id
      title
      cmsId
      levelOneCollectionProgress(levelTwoCollectionProgressId: $levelTwoCollectionProgressId) {
        id
        status
      }
      pages{
        id
        cmsId
        pageProgress(vibLevelTwoLevelOneCollectionId: $vibLevelTwoLevelOneCollectionId, levelTwoCollectionProgressId: $levelTwoCollectionProgressId) {
          id
          status
          breadcrumbItems{
            type
            title
          }
        }
      }
    }
  }
}
`;


export {
  GET_LEVEL_TWO_LEVEL_ONE_COLLECTION,
  GET_PAGE,
};
