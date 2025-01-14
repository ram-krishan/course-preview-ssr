import { isEmpty, map } from 'lodash';


const nodes = (item) => (
  item.edges.map((edge) => edge.node)
);
const getFormattedTitle = (node) => (
  isEmpty(node.display_title) ? node.title : node.display_title
);

const getId = (data) => data.system.uid;

const getFormattedSurveyAnswers = (answers) => {
  return answers.map((answer) => ({
    id: getId(answer),
    title: getFormattedTitle(answer),
    choiceText: answer.choice_text,
    __typename: 'SurveyAnswer',
  }));
};

const getFormattedConfidenceOfResponse = (practiceQuestion) => {
  const confidenceOfResponse = nodes(practiceQuestion.confidence_of_responseConnection)[0];
  return {
    id: getId(confidenceOfResponse),
    title: getFormattedTitle(confidenceOfResponse),
    question: confidenceOfResponse.question,
    surveyAnswers: getFormattedSurveyAnswers(nodes(confidenceOfResponse.question_answersConnection)),
    __typename: 'SurveyQuestion',
  };
};

const getFormattedAnswers = (answers) => {
  return answers.map((answer) => ({
    id: getId(answer),
    answer: answer.display_text || getFormattedTitle(answer),
    explanation: answer.explanation,
    isCorrectResponse: answer.is_correct_response,
    __typename: 'Answer',
  }));
};

const getVideoScenario = (question) => {
  const videoScenario = question.scenario
    .find((scenario) => scenario['__typename'] === 'QuestionScenarioVideoScenario');

  if (!isEmpty(videoScenario)) {
    const videoConnection = nodes(videoScenario['video_scenario']['videoConnection'])[0];

    if (!isEmpty(videoConnection)) {
      const video = nodes(videoConnection['videoConnection'])[0];

      const preview_imageConnection = nodes(videoConnection['preview_imageConnection'])[0];
      let thumbnailUrl;

      if (!isEmpty(preview_imageConnection)) {
        thumbnailUrl = preview_imageConnection.url;
      }

      return {
        fileUrl: video.url,
        thumbnailUrl: thumbnailUrl,
        contentType: 'video/mp4',
        subtitleCmsId: map(videoConnection.subtitlesConnection?.edges || [], 'node.system.uid')[0],
      };
    }
  }
};

const getFormattedQuestion = (practiceQuestion) => {
  const question = nodes(practiceQuestion.questionConnection)[0];
  const video = getVideoScenario(question);
  return {
    id: getId(question),
    title: getFormattedTitle(question),
    question: question.question,
    isMultipleChoiceQuestion: question.question_type === 'Multiple Answers',
    isValid: true,
    isTextOrVedioPresent: !isEmpty(video),
    explanation: nodes(question.answersConnection)[0].explanation,
    answers: getFormattedAnswers(nodes(question.answersConnection)),
    video: video,
    __typename: 'Question',
  };
};

const getPracticeQuestionFormattedData = (practiceQuestionData) => {
  const { practice_question } = practiceQuestionData;
  return {
    id: getId(practice_question),
    question: getFormattedQuestion(practice_question),
    confidenceOfResponse: getFormattedConfidenceOfResponse(practice_question),
  };
};

export default getPracticeQuestionFormattedData;
