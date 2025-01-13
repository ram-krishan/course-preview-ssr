import gql from 'graphql-tag';

const PageCardReferenceFragment = gql`
  fragment PageCardReferenceFragment on CardReference {
    title
    isexpandable
    showSecondaryContent
    secondaryContentPosition {
      width
      position
    }
    secondaryComponents {
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
          submittedAnswers(pageProgressId: $pageProgressId){
            id
          }
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
        associatedContentPosition
        associatedContentWidth
        showAssociatedContent
        associatedContent {
          type
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
    components {
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
          submittedAnswers(pageProgressId: $pageProgressId){
            id
          }
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
          showAssociatedContent
          associatedContentPosition
          associatedContentWidth
          associatedContent {
            type
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
`;

const ImageAssociatedContentCardReferenceFragment = gql`
  fragment ImageAssociatedContentCardReferenceFragment on CardReference {
    title
    isexpandable
    showSecondaryContent
    secondaryContentPosition {
      width
      position
    }
    secondaryComponents {
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
        showAssociatedContent
      }
      ... on VideoReference {
        video {
          id
          fileUrl
          title
          thumbnailUrl
          contentType
          showAssociatedContent
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
    components {
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
        showAssociatedContent
      }
      ... on VideoReference {
        video {
          id
          fileUrl
          title
          thumbnailUrl
          showAssociatedContent
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
`;

export { PageCardReferenceFragment, ImageAssociatedContentCardReferenceFragment };
