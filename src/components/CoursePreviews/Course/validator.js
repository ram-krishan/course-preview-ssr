import {
  clone,
  compact,
  isEmpty,
  isNil,
  uniq,
} from 'lodash';
import { coursePreview } from '../../../graphql_states/contentstack';

let errors = [];
let apolloClient = null;
let courseCmsId = null;

const errorHashKeys = {
  course: 'course',
  sentimentSurvey1Connection: 'sentimentSurvey1Connection',
  sentimentSurvey2Connection: 'sentimentSurvey2Connection',
  sentimentSurvey3Connection: 'sentimentSurvey3Connection',
  assessment: 'assessments',
  assessmentAssessmentExam: 'assessmentAssessmentExam',
  assessmentExamQuestion: 'assessmentExamQuestion',
  assessmentExamQuestionAnswer: 'assessmentExamQuestionAnswer',
  measurementCategory: 'measurementCategory',
  sentimentSurveyQuestion: 'sentimentSurveyQuestion',
  sentimentSurveyQuestionAnswer: 'sentimentSurveyQuestionAnswer',
  goal: 'goal',
  netPromoterScoreSurvey: 'netPromoterScoreSurvey',
  npsSurveyQuestion: 'netPromoterScoreSurveySurveyQuestion',
  npsSurveyQuestionAnswer: 'netPromoterScoreSurveySurveyQuestionAnswer',
  seniorLeaderMessage: 'seniorLeaderMessage',
  level3Collection: 'level_3',
  level2Collection: 'level_2',
  level1Collection: 'level_1',
  page: 'page4',
  level2CollectionExam: 'level2CollectionExam',
  question: 'question',
  questionAnswer: 'questionAnswer',
  practiceQuestion: 'practiceQuestion',
  confidenceOfResponse: 'confidenceOfResponse',
};

const getUid = (node) => node.system.uid;

const isEmptyData = (data) => (typeof (data) === 'number' ? false : isEmpty(data));

const canCreateErrorHash = (errorKey) => {
  const allowedKeys = [
    errorHashKeys.course,
    errorHashKeys.sentimentSurvey1Connection,
    errorHashKeys.sentimentSurvey2Connection,
    errorHashKeys.sentimentSurvey3Connection,
    errorHashKeys.assessment,
    errorHashKeys.goal,
    errorHashKeys.netPromoterScoreSurvey,
    errorHashKeys.seniorLeaderMessage,
    errorHashKeys.level3Collection,
    errorHashKeys.level2Collection,
    errorHashKeys.level1Collection,
    errorHashKeys.page,
    errorHashKeys.level2CollectionExam,
    errorHashKeys.practiceQuestion,
  ];

  return allowedKeys.includes(errorKey);
};

const addNodeInErrorHash = (errorKey, cmsId) => {
  if (!canCreateErrorHash(errorKey)) return null;
  const initialErrorHash = {
    typeName: errorKey,
    objectCmsId: cmsId,
    isValid: true,
    errorMessages: [],
  };

  errors.push(initialErrorHash);
  return initialErrorHash;
};

const addErrors = (errorKey, objectCmsId, parentObjectCmsIds, errorMessages) => {
  let errorHash = errors.find((error) => (error.objectCmsId === objectCmsId));

  if (!isEmptyData(parentObjectCmsIds)) {
    const parentErrors = errors.filter((error) => (
      parentObjectCmsIds.includes(error.objectCmsId)
    ));
    parentErrors.forEach((parentErrorHash) => {
      parentErrorHash.isValid = false;
    });
  }

  if (isEmptyData(errorHash)) {
    errorHash = addNodeInErrorHash(errorKey, objectCmsId);
  }

  if (!isEmptyData(errorHash)) {
    if (!isEmpty(errorMessages)) {
      const newErrorMessages = [
        ...errorHash.errorMessages,
        ...errorMessages,
      ];
      errorHash.errorMessages = uniq(newErrorMessages);
    }
    errorHash.isValid = false;
  }
};

const addErrorsInCourseNode = (errorMessages) => {
  addErrors(errorHashKeys.course, courseCmsId, null, errorMessages);
};

// validators

const validateMeasurementCategory = async (measurementCategoryNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  if (isEmptyData(measurementCategoryNode.title)) {
    await addErrors(
      errorHashKeys.measurementCategory,
      getUid(measurementCategoryNode),
      errorNodeIds,
    );

    return false;
  }
  return true;
};

const validateQuestionAnswer = (answerNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  if (isEmptyData(answerNode.title)) {
    addErrors(errorHashKeys.questionAnswer, getUid(answerNode), errorNodeIds, ['Answer required fields must be present']);
    return false;
  }
  return true;
};

const validateQuestion = async (questionId, parentNodeIds, objectErrors) => {
  const errorNodeIds = clone(parentNodeIds);
  const query = coursePreview.queries.GET_QUESTION_DATA;
  const response = await apolloClient.query({ query, variables: { uid: questionId }, fetchPolicy: 'network-only' });

  const {
    title,
    question,
    question_type: questionType,
    answersConnection,
    measurement_categoryConnection: measurementCategory,
  } = response.data.question;

  if (
    isEmptyData(title)
    || isEmptyData(question)
    || isEmptyData(answersConnection.edges)
    || isEmptyData(measurementCategory.edges)
    || isEmptyData(questionType)
  ) {
    addErrors(errorHashKeys.question, questionId, errorNodeIds);
    return false;
  }
  errorNodeIds.push(questionId);

  await Promise.all(answersConnection.edges.map(async (answer) => {
    const answerNode = answer.node;
    const answerId = getUid(answerNode);
    addNodeInErrorHash(errorHashKeys.questionAnswer, answerId);

    const isValid = await validateQuestionAnswer(answerNode, errorNodeIds);
    return isValid ? null : answerId;
  })).then((ansResponse) => {
    const ids = compact(ansResponse);

    if (!isEmpty(objectErrors) && !isEmpty(ids)) {
      objectErrors.inValidAnswerIds = [...objectErrors.inValidAnswerIds, ...ansResponse];
    }
  });

  const mesCatNode = measurementCategory.edges[0].node;
  await validateMeasurementCategory(mesCatNode, errorNodeIds).then((measurementCatRes) => {
    const ids = compact(measurementCatRes);

    if (!isEmpty(ids)) {
      objectErrors.inValidQuestionMeasurementCatId = [
        ...objectErrors.inValidQuestionMeasurementCatId,
        getUid(mesCatNode),
      ];
    }
  });

  return true;
};

const validateAssessmentExamQuestionAnswer = async (answerNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);
  const answerId = getUid(answerNode);
  if (
    isEmptyData(answerNode.title)
    || isEmptyData(answerNode.answer_option)
    || isEmptyData(answerNode.answer_weight)
  ) {
    await addErrors(errorHashKeys.assessmentExamQuestionAnswer, answerId, errorNodeIds);
    // , 'Assessment exam question answer required fields must be present'
    return false;
  }
  return true;
};

const validateAssessmentExamQuestion = async (questionUid, parentNodeIds, assessmentErrors) => {
  const errorNodeIds = clone(parentNodeIds);

  const query = coursePreview.queries.GET_ASSESSMENT_EXAM_QUESTION_DATA;
  const response = await apolloClient.query({ query, variables: { uid: questionUid }, fetchPolicy: 'network-only' });

  const {
    title,
    question,
    answersConnection,
    measurement_categoryConnection: measurementCategory,
  } = response.data.assessment_question;

  if (
    isEmptyData(title)
    || isEmptyData(question)
    || isEmptyData(answersConnection.edges)
    || isEmptyData(measurementCategory.edges)
  ) {
    addErrors(errorHashKeys.assessmentExamQuestion, questionUid, errorNodeIds);
    // , 'Assessment exam question required fields must be present'
    return false;
  }
  errorNodeIds.push(questionUid);

  await Promise.all(answersConnection.edges.map(async (answer) => {
    const answerNode = answer.node;
    const answerId = getUid(answerNode);
    addNodeInErrorHash(errorHashKeys.assessmentExamQuestionAnswer, getUid(answerNode));
    const isValid = await validateAssessmentExamQuestionAnswer(answer.node, errorNodeIds);

    return !isValid ? answerId : null;
  })).then((answerResponse) => {
    const inValidAssessmentAnswerIds = compact(answerResponse);

    if (!isEmpty(assessmentErrors)) {
      assessmentErrors.inValidAssessmentAnswerIds = [
        ...assessmentErrors.inValidAssessmentAnswerIds,
        ...inValidAssessmentAnswerIds,
      ];
    }
  });
  const mesCatNode = measurementCategory.edges[0].node;
  await validateMeasurementCategory(mesCatNode, errorNodeIds).then((isValidMeasCat) => {
    if (!isValidMeasCat) {
      assessmentErrors.inValidQuestionMeasurementCatId = getUid(mesCatNode);
    }
  });

  return true;
};

const validateAssessmentExam = async (assessmentExamUid, parentNodeIds, assessmentErrors) => {
  const errorNodeIds = clone(parentNodeIds);

  const query = coursePreview.queries.GET_ASSESSMENT_EXAM_DATA;
  const response = await apolloClient.query({ query, variables: { uid: assessmentExamUid }, fetchPolicy: 'network-only' });

  const { title, questionsConnection } = response.data.assessment_exam;

  if (isEmptyData(title) || isEmptyData(questionsConnection.edges)) {
    addErrors(errorHashKeys.assessmentAssessmentExam, assessmentExamUid, errorNodeIds);
    // , 'Assessment Exam title or question must be present'
    return false;
  }
  errorNodeIds.push(assessmentExamUid);

  await Promise.all(questionsConnection.edges.map(async (question) => {
    const questionId = getUid(question.node);
    addNodeInErrorHash(errorHashKeys.assessmentExamQuestion, questionId);

    const isValid = await validateAssessmentExamQuestion(
      questionId,
      errorNodeIds,
      assessmentErrors,
    );
    return isValid ? null : questionId;
  })).then((examQuesRes) => {
    const inValidAssessmentQuestionIds = compact(examQuesRes);

    if (!isEmptyData(examQuesRes)) {
      assessmentErrors.inValidAssessmentQuestionIds = [
        ...assessmentErrors.inValidAssessmentQuestionIds,
        ...inValidAssessmentQuestionIds,
      ];
    }
  });

  return true;
};

const validateAssessment = async (assessmentUid, parentNodeIds, assessmentErrors) => {
  const errorNodeIds = clone(parentNodeIds);

  const query = coursePreview.queries.GET_ASSESSMENT_DATA;
  const response = await apolloClient.query({
    query,
    variables: { uid: assessmentUid },
    fetchPolicy: 'network-only',
  });

  const { assessments } = response.data;
  if (isEmptyData(assessments.examsConnection.edges) || isEmptyData(assessments.title)) {
    addErrors(errorHashKeys.assessment, assessmentUid, errorNodeIds);
    return false;
  }
  errorNodeIds.push(assessmentUid);

  await Promise.all(assessments.examsConnection.edges.map(async (assessmentExam) => {
    const examId = getUid(assessmentExam.node);
    addNodeInErrorHash(errorHashKeys.assessmentAssessmentExam, examId);

    const isValidExam = await validateAssessmentExam(examId, errorNodeIds, assessmentErrors);
    return isValidExam ? null : examId;
  })).then((assessmentExamResponse) => {
    const inValidAssessmentExamIds = compact(assessmentExamResponse);

    if (!isEmpty(inValidAssessmentExamIds)) {
      assessmentErrors.inValidAssessmentExamIds = [
        ...assessmentErrors.inValidAssessmentExamIds,
        ...inValidAssessmentExamIds,
      ];
    }
  });

  return true;
};

const validateSurveyAnswer = (surveyAnswerNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);
  const { title, choice_text: choiceText, value } = surveyAnswerNode;
  if (isEmptyData(title) || isEmptyData(choiceText) || isEmptyData(value)) {
    addErrors(errorHashKeys.sentimentSurveyQuestionAnswer, getUid(surveyAnswerNode), errorNodeIds);
    return false;
  }
  return true;
};

const validateSurveyQuestionAssociatedData = async (
  surveyQuestionNode,
  parentNodeIds,
  surveyErrors,
) => {
  const errorNodeIds = clone(parentNodeIds);

  const query = coursePreview.queries.GET_SURVEY_QUESTION_DATA;
  const surveyQuestionId = getUid(surveyQuestionNode);
  const response = await apolloClient.query({
    query, variables: { uid: surveyQuestionId }, fetchPolicy: 'network-only',
  });

  const {
    title,
    question,
    question_answersConnection: quesAnsConnection,
  } = response.data.survey_question;

  if (isEmptyData(title) || isEmptyData(question) || isEmptyData(quesAnsConnection.edges[0])) {
    addErrors(errorHashKeys.sentimentSurveyQuestion, surveyQuestionId, errorNodeIds);
    // , 'Survey question required fields must be present'
    return false;
  }
  errorNodeIds.push(surveyQuestionId);

  await Promise.all(quesAnsConnection.edges.map(async (answer) => {
    const answerId = getUid(answer.node);
    addNodeInErrorHash(errorHashKeys.sentimentSurveyQuestionAnswer, getUid(answer.node));
    const isValid = await validateSurveyAnswer(answer.node, errorNodeIds);

    return isValid ? null : answerId;
  })).then((surveyAnsResponse) => {
    const surveyAnsIds = compact(surveyAnsResponse);
    if (!isEmpty(surveyAnsIds)) {
      surveyErrors.inValidSurveyAnswerIds = [
        ...surveyErrors.inValidSurveyAnswerIds,
        ...surveyAnsIds,
      ];
    }
  });

  return true;
};

const validateSentimentSurveyQuestion = async (sentimentSurveyUid, parentNodeIds, surveyErrors) => {
  const errorNodeIds = clone(parentNodeIds);

  const query = coursePreview.queries.GET_SENTIMENT_SURVEY_DATA;
  const response = await apolloClient.query({
    query, variables: { uid: sentimentSurveyUid }, fetchPolicy: 'network-only',
  });
  const { questionsConnection } = response.data.sentiment_survey;

  if (isEmptyData(questionsConnection.edges)) {
    addErrors(errorHashKeys.sentimentSurvey, sentimentSurveyUid, errorNodeIds);
    return false;
  }

  errorNodeIds.push(sentimentSurveyUid);
  await Promise.all(questionsConnection.edges.map(async (questionEdge) => {
    const quesNode = questionEdge.node;
    const quesId = getUid(quesNode);

    addNodeInErrorHash(errorHashKeys.sentimentSurveyQuestion, getUid(quesNode));
    const isValid = await validateSurveyQuestionAssociatedData(
      quesNode,
      errorNodeIds,
      surveyErrors,
    );

    return isValid ? null : quesId;
  })).then((surveyQuesResponse) => {
    const surveyQuesIds = compact(surveyQuesResponse);

    if (!isEmpty(surveyQuesIds)) {
      surveyErrors.inValidSentimentSurveyQuestionIds = [
        ...surveyErrors.inValidSentimentSurveyQuestionIds,
        ...surveyQuesIds,
      ];
    }
  });

  return true;
};

const validateNpsSurveyAnswer = (npsAnsNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  if (
    isEmptyData(npsAnsNode.choice_text)
    || isEmptyData(npsAnsNode.title)
    || isEmptyData(npsAnsNode.value)
  ) {
    addErrors(errorHashKeys.npsSurveyQuestionAnswer, getUid(npsAnsNode), errorNodeIds);
    return false;
    // , "Net promoter score survey question's answer required field is not valid"
  }
  return true;
};

const validateNpsSurveyQuestion = async (npsSurveyQuestNode, parentNodeIds, npsErrors) => {
  const errorNodeIds = clone(parentNodeIds);

  if (
    isEmptyData(npsSurveyQuestNode.title)
    || isEmptyData(npsSurveyQuestNode.question)
    || isEmptyData(npsSurveyQuestNode.question_answersConnection.edges)
  ) {
    addErrors(errorHashKeys.npsSurveyQuestion, getUid(npsSurveyQuestNode), errorNodeIds);
    return false;
  }
  errorNodeIds.push(getUid(npsSurveyQuestNode));

  await Promise.all(
    npsSurveyQuestNode.question_answersConnection.edges.map(async (surveyAns) => {
      const isValid = await validateNpsSurveyAnswer(surveyAns.node, errorNodeIds);

      return isValid ? null : getUid(surveyAns.node);
    }),
  ).then((npsAnswerRes) => {
    const ansIds = compact(npsAnswerRes);
    if (!isEmpty(ansIds)) {
      npsErrors.inValidNpsAnswerIds = [
        ...npsErrors.inValidNpsAnswerIds,
        ...ansIds,
      ];
    }
  });
  return true;
};

const validateNetPromoterScoreSurvey = async (npsSurveyNode, parentNodeIds, npsErrors) => {
  const errorNodeIds = clone(parentNodeIds);
  const npsNodeId = getUid(npsSurveyNode);

  const query = coursePreview.queries.GET_NET_PROMOTER_SCORE_SURVEY_DATA;
  const response = await apolloClient.query({ query, variables: { uid: npsNodeId }, fetchPolicy: 'network-only' });
  const netPromoterScoreSurvey = response.data.net_promoter_score_survey;

  if (
    isEmptyData(netPromoterScoreSurvey.title)
    || isEmptyData(netPromoterScoreSurvey.heading)
    || isEmptyData(netPromoterScoreSurvey.low_rating_hint_text)
    || isEmptyData(netPromoterScoreSurvey.high_rating_hint_text)
    || (isEmptyData(netPromoterScoreSurvey.questionConnection.edges))
  ) {
    addErrors(errorHashKeys.netPromoterScoreSurvey, npsNodeId, errorNodeIds);
    return false;
  }

  errorNodeIds.push(npsNodeId);
  const questionNode = netPromoterScoreSurvey.questionConnection.edges[0].node;
  await validateNpsSurveyQuestion(questionNode, errorNodeIds, npsErrors).then((isValidQues) => {
    if (!isValidQues) npsErrors.inValidNpsQuestionId = getUid(questionNode);
  });

  return true;
};

const validateSeniorLeaderMessage = (seniorLeaderMessageNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  if (isEmptyData(seniorLeaderMessageNode.title) || isEmptyData(seniorLeaderMessageNode.header)) {
    addErrors(errorHashKeys.seniorLeaderMessage, getUid(seniorLeaderMessageNode), errorNodeIds, ['Senior leader message required fields are not valid']);
  }
};

const validateGoal = (goalNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  if (isEmptyData(goalNode.title) || isEmptyData(goalNode.coaching_prompt)) {
    const errorMessages = [];
    addErrors(errorHashKeys.goal, getUid(goalNode), errorNodeIds, errorMessages);
    return false;
  }

  return true;
};

const validateSentimentSurvey = async (surveyNode, errorKey, surveyErrors) => {
  const surveyId = getUid(surveyNode);
  const parentNodeIds = [courseCmsId];

  if (isEmptyData(surveyNode.title)) {
    addErrors(errorKey, surveyId, parentNodeIds);
    return false;
  }

  await validateSentimentSurveyQuestion(surveyId, parentNodeIds, surveyErrors)
    .then((isValidSentimentSurveyQues) => {
      if (!isValidSentimentSurveyQues) {
        surveyErrors.errorMessages.push('In sentiment_survey question must be present');
      }
      return isValidSentimentSurveyQues;
    });

  return true;
};

const addErrorMessagesInSentimentSurvey = (surveyErrors, isValid, surveyId) => {
  const {
    errorMessages,
    inValidSentimentSurveyQuestionIds,
    inValidSurveyAnswerIds,
  } = surveyErrors;

  if (!isNil(isValid) && !isValid) {
    errorMessages.push(`Invalid sentiment survey found, invalid_sentiment_survey_cms_id: ${surveyId}`);
  }
  if (!isEmptyData(inValidSentimentSurveyQuestionIds)) {
    errorMessages.push(`Invalid survey questions found, invalid_survey_question_cms_ids: [${uniq(inValidSentimentSurveyQuestionIds)}]`);
  }
  if (!isEmptyData(inValidSurveyAnswerIds)) {
    errorMessages.push(`Invalid survey answers found, invalid_survey_answers_cms_ids: [${uniq(inValidSurveyAnswerIds)}]`);
  }
};

const validateFirstSentimentSurvey = async (surveyNode) => {
  const surveyErrors = {
    errorMessages: [],
    inValidSentimentSurveyQuestionIds: [],
    inValidSurveyAnswerIds: [],
  };
  const surveyId = getUid(surveyNode);

  addNodeInErrorHash(errorHashKeys.sentimentSurvey1Connection, surveyId);
  await validateSentimentSurvey(
    surveyNode,
    errorHashKeys.sentimentSurvey1Connection,
    surveyErrors,
  ).then((isValidSentimentSurvey) => {
    addErrorMessagesInSentimentSurvey(surveyErrors, isValidSentimentSurvey, surveyId);
    if (!isEmpty(surveyErrors.errorMessages)) {
      addErrors(
        errorHashKeys.sentimentSurvey1Connection,
        surveyId,
        null,
        surveyErrors.errorMessages,
      );
    }
  });
};

const validateSecondSentimentSurvey = async (surveyNode) => {
  const surveyErrors = {
    errorMessages: [],
    inValidSentimentSurveyQuestionIds: [],
    inValidSurveyAnswerIds: [],
  };
  const surveyId = getUid(surveyNode);

  addNodeInErrorHash(errorHashKeys.sentimentSurvey2Connection, surveyId);
  await validateSentimentSurvey(
    surveyNode,
    errorHashKeys.sentimentSurvey2Connection,
    surveyErrors,
  ).then((isValidSentiment2) => {
    addErrorMessagesInSentimentSurvey(surveyErrors, isValidSentiment2, surveyId);

    if (!isEmpty(surveyErrors.errorMessages)) {
      addErrors(
        errorHashKeys.sentimentSurvey2Connection,
        surveyId,
        null,
        surveyErrors.errorMessages,
      );
    }
  });
};

const validateThirdSentimentSurvey = async (surveyNode) => {
  const surveyErrors = {
    errorMessages: [],
    inValidSentimentSurveyQuestionIds: [],
    inValidSurveyAnswerIds: [],
  };
  const surveyId = getUid(surveyNode);

  addNodeInErrorHash(errorHashKeys.sentimentSurvey3Connection, surveyId);
  await validateSentimentSurvey(
    surveyNode,
    errorHashKeys.sentimentSurvey3Connection,
    surveyErrors,
  ).then((isValidSentiment3) => {
    addErrorMessagesInSentimentSurvey(surveyErrors, isValidSentiment3, surveyId);

    if (!isEmpty(surveyErrors.errorMessages)) {
      addErrors(
        errorHashKeys.sentimentSurvey3Connection,
        surveyId,
        null,
        surveyErrors.errorMessages,
      );
    }
  });
};

const validateCourseSentimentSurveys = async (metaData) => {
  if (!isEmptyData(metaData.sentiment_survey1Connection.edges)) {
    validateFirstSentimentSurvey(metaData.sentiment_survey1Connection.edges[0].node);
  }

  if (!isEmptyData(metaData.sentiment_survey2Connection.edges)) {
    validateSecondSentimentSurvey(metaData.sentiment_survey2Connection.edges[0].node);
  }

  if (!isEmptyData(metaData.sentiment_survey3Connection.edges)) {
    validateThirdSentimentSurvey(metaData.sentiment_survey3Connection.edges[0].node);
  }
};

const addErrorMessagesInAssessment = (assessmentErrors, isValidAssessment, assessmentUid) => {
  const {
    errorMessages,
    inValidAssessmentExamIds,
    inValidAssessmentQuestionIds,
    inValidAssessmentAnswerIds,
    inValidQuestionMeasurementCatId,
  } = assessmentErrors;

  if (!isNil(isValidAssessment) && !isValidAssessment) {
    errorMessages.push(`Invalid assessment found, invalid_assessment_cms_id: ${assessmentUid}`);
  }
  if (!isEmptyData(inValidAssessmentExamIds)) {
    errorMessages.push(`Invalid assessment exams found, invalid_exams_cms_ids: [${uniq(inValidAssessmentExamIds)}]`);
  }
  if (!isEmptyData(inValidAssessmentQuestionIds)) {
    errorMessages.push(`Invalid assessment questions found, invalid_assessment_question_cms_ids: [${uniq(inValidAssessmentQuestionIds)}]`);
  }
  if (!isEmptyData(inValidAssessmentAnswerIds)) {
    errorMessages.push(`Invalid assessment answers found, invalid_assessment_answers_ids: [${uniq(inValidAssessmentAnswerIds)}]`);
  }
  if (!isEmptyData(inValidQuestionMeasurementCatId)) {
    errorMessages.push(`Invalid measurement category found, invalid_measurement_category_id: [${inValidQuestionMeasurementCatId}]`);
  }
};

const validateCourseAssessment = async (metaData) => {
  if (isEmptyData(metaData.assessmentConnection.edges)) {
    addErrorsInCourseNode(['Assessment must be present in course']);
  } else {
    const assessmentUid = getUid(metaData.assessmentConnection.edges[0].node);
    const assessmentErrors = {
      errorMessages: [],
      inValidAssessmentExamIds: [],
      inValidAssessmentQuestionIds: [],
      inValidAssessmentAnswerIds: [],
      inValidQuestionMeasurementCatId: null,
    };
    addNodeInErrorHash(errorHashKeys.assessment, assessmentUid);
    await validateAssessment(assessmentUid, [courseCmsId], assessmentErrors)
      .then((isValidAssessment) => {
        addErrorMessagesInAssessment(assessmentErrors, isValidAssessment, assessmentUid);
        if (!isEmpty(assessmentErrors.errorMessages)) {
          addErrors(errorHashKeys.assessment, assessmentUid, null, assessmentErrors.errorMessages);
        }
      });
  }
};

const validateCourseGoals = async (metaData) => {
  if (isEmptyData(metaData.goalsConnection.edges)) {
    addErrorsInCourseNode(['Goal must be present in course']);
  } else {
    await Promise.all(metaData.goalsConnection.edges.map(async (goal) => {
      const goalNode = goal.node;
      const goalId = getUid(goalNode);

      addNodeInErrorHash(errorHashKeys.goal, getUid(goalNode));
      const isValid = await validateGoal(goalNode, [courseCmsId]);

      return isValid ? null : goalId;
    })).then((goalResult) => {
      const goalIds = compact(goalResult);
      if (!isEmpty(goalIds)) {
        goalIds.forEach((goalId) => {
          addErrors(errorHashKeys.goal, goalId, null, [`Invalid goal found, invalid_goal_id: ${goalId}`]);
        });
      }
    });
  }
};

const addErrorMessagesInNps = (npsErrors, isValidNps, npsId) => {
  const {
    errorMessages,
    inValidNpsQuestionId,
    inValidNpsAnswerIds,
  } = npsErrors;

  if (!isNil(isValidNps) && !isValidNps) {
    errorMessages.push(`Invalid Net promoter score survey found, invalid_nps_cms_id: ${npsId}`);
  }
  if (!isEmptyData(inValidNpsQuestionId)) {
    errorMessages.push(`Invalid Net promoter score survey survey_questions found, invalid_nps_question_cms_ids: ${inValidNpsQuestionId}`);
  }
  if (!isEmptyData(inValidNpsAnswerIds)) {
    errorMessages.push(`Invalid Net promoter score survey survey_answers found, invalid_nps_answers_ids: [${uniq(inValidNpsAnswerIds)}]`);
  }
};

const validateCourseNetPromoterScoreSurvey = async (metaData) => {
  if (isEmptyData(metaData.net_promoter_score_surveyConnection.edges)) {
    addErrorsInCourseNode(['Net promoter score survey must be present in course']);
  } else {
    const npsErrors = {
      errorMessages: [],
      inValidNpsQuestionId: [],
      inValidNpsAnswerIds: [],
    };

    const npsNode = metaData.net_promoter_score_surveyConnection.edges[0].node;
    const npsId = getUid(npsNode);
    const parentNodeIds = [courseCmsId];
    addNodeInErrorHash(errorHashKeys.netPromoterScoreSurvey, npsId);

    await validateNetPromoterScoreSurvey(npsNode, parentNodeIds, npsErrors).then((isValidNps) => {
      addErrorMessagesInNps(npsErrors, isValidNps, npsId);
      if (!isEmpty(npsErrors.errorMessages)) {
        addErrors(errorHashKeys.netPromoterScoreSurvey, npsId, null, npsErrors.errorMessages);
      }
    });
  }
};

const validateCourseMeasurementCategory = async (metaData) => {
  if (!isEmptyData(metaData.measurement_categoriesConnection.edges)) {
    const parentNodeIds = [courseCmsId];
    await Promise.all(
      metaData.measurement_categoriesConnection.edges.map(async (measurementCategory) => {
        const measurementCategoryNode = measurementCategory.node;
        const nodeId = getUid(measurementCategoryNode);

        addNodeInErrorHash(errorHashKeys.measurementCategory, nodeId);
        const isValid = await validateMeasurementCategory(measurementCategoryNode, parentNodeIds);
        return isValid ? null : nodeId;
      }),
    ).then((mesCatRes) => {
      const inValidMesCatIds = compact(mesCatRes);
      if (!isEmpty(inValidMesCatIds)) {
        const errorMessage = `Invalid measurement categories found, invalid_measurement_categories_ids: [${uniq(inValidMesCatIds)}]`;
        addErrors(errorHashKeys.course, courseCmsId, null, [errorMessage]);
      }
    });
  }
};

const validateCourseSeniorLeaderMessage = async (metaData) => {
  if (isEmptyData(metaData.senior_leader_messageConnection.edges)) {
    addErrorsInCourseNode(['Senior leader message must be present in course']);
  } else {
    const slmNode = metaData.senior_leader_messageConnection.edges[0].node;
    const parentNodeIds = [courseCmsId];
    addNodeInErrorHash(errorHashKeys.seniorLeaderMessage, getUid(slmNode));

    await validateSeniorLeaderMessage(slmNode, parentNodeIds);
  }
};

const validatePage = (pagesConnectionNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);
  const pageId = getUid(pagesConnectionNode);

  if (isEmptyData(pagesConnectionNode.title)) {
    addErrors(errorHashKeys.page, pageId, errorNodeIds, [`Invalid page found, invalid_page_cms_id: ${pageId}`]);
    return false;
  }
  return true;
};

const validateLevelOneCollection = async (levelOneCollectionNode, parentNodeIds, objectErrors) => {
  const errorNodeIds = clone(parentNodeIds);

  const l1CollId = getUid(levelOneCollectionNode);
  const query = coursePreview.queries.GET_LEVEL_ONE_COLLECTION;
  const response = await apolloClient.query({ query, variables: { uid: l1CollId }, fetchPolicy: 'network-only' });

  const l1CollData = response.data.level_1;
  if (isEmptyData(l1CollData.title) || isEmptyData(l1CollData.pagesConnection.edges)) {
    addErrors(errorHashKeys.level1Collection, l1CollId, errorNodeIds, [`Invalid level one collection found, invalid_level_one_collection_cms_id: ${l1CollId}`]);
  } else {
    errorNodeIds.push(l1CollId);

    await Promise.all(l1CollData.pagesConnection.edges.map(async (page) => {
      const pageId = getUid(page.node);
      addNodeInErrorHash(errorHashKeys.page, pageId);
      const isValid = await validatePage(page.node, errorNodeIds);

      return isValid ? null : pageId;
    })).then((inValidPageIds) => {
      const pageIds = compact(inValidPageIds);
      if (!isEmpty(objectErrors) && !isEmpty(pageIds)) {
        objectErrors.inValidPageIds = [...objectErrors.inValidPageIds, ...pageIds];
      }
    });
  }
};

const validatePracticeQuestion = async (practiceQuesNode, parentNodeIds, practiceQuesErrors) => {
  const errorNodeIds = clone(parentNodeIds);

  const practiceQuesId = getUid(practiceQuesNode);
  const query = coursePreview.queries.GET_PRACTICE_QUESTION_DATA;
  const response = await apolloClient.query({
    query,
    variables: { uid: practiceQuesId },
    fetchPolicy: 'network-only',
  });

  const practiceQuestion = response.data.practice_question;
  if (
    isEmptyData(practiceQuestion.title)
    || isEmptyData(practiceQuestion.questionConnection.edges)
    || isEmptyData(practiceQuestion.confidence_of_responseConnection.edges)
    || isEmptyData(practiceQuestion.associated_lessonConnection.edges)
  ) {
    addErrors(errorHashKeys.practiceQuestion, practiceQuesId, errorNodeIds);
    // , 'Practice question required field is not valid'
    return false;
  }
  errorNodeIds.push(getUid(practiceQuesNode));

  const questionNode = practiceQuestion.questionConnection.edges[0].node;
  addNodeInErrorHash(errorHashKeys.question, getUid(questionNode));
  await validateQuestion(getUid(questionNode), errorNodeIds, practiceQuesErrors).then((isValid) => {
    if (!isValid) {
      practiceQuesErrors.inValidQuestionId = getUid(questionNode);
    }
  });

  const confidenceOfResNode = practiceQuestion.confidence_of_responseConnection.edges[0].node;
  addNodeInErrorHash(errorHashKeys.confidenceOfResponse, getUid(confidenceOfResNode));
  await validateSurveyQuestionAssociatedData(
    confidenceOfResNode,
    errorNodeIds,
    practiceQuesErrors,
  ).then((isValid) => {
    if (!isValid) {
      practiceQuesErrors.inValidSurveyQuestionId = getUid(confidenceOfResNode);
    }
  });

  const l1CollNode = practiceQuestion.associated_lessonConnection.edges[0].node;
  addNodeInErrorHash(errorHashKeys.level1Collection, getUid(l1CollNode));
  await validateLevelOneCollection(l1CollNode, errorNodeIds, practiceQuesErrors)
    .then((isValid) => {
      if (!isValid) {
        practiceQuesErrors.inValidLevelOneCollectionId = getUid(l1CollNode);
      }
    });

  return true;
};

const addErrorMessagesInPracticeQuestion = (practiceQuesErrors, practiceQuesRes) => {
  const {
    errorMessages,
    inValidQuestionId,
    inValidAnswerIds,
    inValidSurveyQuestionId,
    inValidSurveyAnswerIds,
    inValidPageIds,
    inValidLevelOneCollectionId,
    inValidQuestionMeasurementCatId,
  } = practiceQuesErrors;

  if (!isNil(practiceQuesRes) && !isEmptyData(practiceQuesRes)) {
    errorMessages.push(`Invalid practice_questions found, invalid_practice_question_cms_ids: ${practiceQuesRes}`);
  }

  if (!isEmptyData(inValidQuestionId)) {
    errorMessages.push(`Invalid question found, invalid_question_cms_id: ${inValidQuestionId}`);
  }
  if (!isEmptyData(inValidAnswerIds)) {
    errorMessages.push(`Invalid answers found, invalid_answer_cms_ids: [${uniq(inValidAnswerIds)}]`);
  }
  if (!isEmptyData(inValidSurveyQuestionId)) {
    errorMessages.push(`Invalid survey question found, invalid_survey_question_cms_id: [${inValidSurveyQuestionId}]`);
  }
  if (!isEmptyData(inValidSurveyAnswerIds)) {
    errorMessages.push(`Invalid survey answers found, invalid_survey_answers_ids: [${uniq(inValidSurveyAnswerIds)}]`);
  }
  if (!isEmptyData(inValidLevelOneCollectionId)) {
    errorMessages.push(`Invalid level one collection found, invalid_level_one_collection_id: [${inValidLevelOneCollectionId}]`);
  }
  if (!isEmptyData(inValidPageIds)) {
    errorMessages.push(`Invalid pages found, invalid_pages_ids: [${uniq(inValidPageIds)}]`);
  }
  if (!isEmptyData(inValidQuestionMeasurementCatId)) {
    errorMessages.push(`Invalid measurement category found, invalid_measurement_category_ids: [${inValidQuestionMeasurementCatId}]`);
  }
};

const validateCoursePracticeQuestion = async (metaData) => {
  if (!isEmptyData(metaData.practice_questionsConnection.edges)) {
    const practiceQuesErrors = {
      errorMessages: [],
      inValidQuestionId: [],
      inValidAnswerIds: [],
      inValidSurveyQuestionId: [],
      inValidSurveyAnswerIds: [],
      inValidPageIds: [],
      inValidLevelOneCollectionId: null,
      inValidQuestionMeasurementCatId: null,
    };

    await Promise.all(metaData.practice_questionsConnection.edges.map(async (practiceQues) => {
      const practiceQuesNode = practiceQues.node;
      const practiceQuesId = getUid(practiceQuesNode);

      addNodeInErrorHash(errorHashKeys.practiceQuestion, getUid(practiceQuesNode));
      const isValid = await validatePracticeQuestion(
        practiceQuesNode,
        [courseCmsId],
        practiceQuesErrors,
      );
      return isValid ? null : practiceQuesId;
    })).then((practiceQuesRes) => {
      const practiceQuesIds = compact(practiceQuesRes);

      addErrorMessagesInPracticeQuestion(practiceQuesErrors, practiceQuesIds);
      practiceQuesIds.forEach((practiceId) => {
        addErrors(
          errorHashKeys.practiceQuestion,
          practiceId,
          null,
          practiceQuesErrors.errorMessages,
        );
      });
    });
  }
};

const validateLevelCourseMetaData = async (metaData) => {
  await Promise.all([
    await validateCourseSentimentSurveys(metaData),
    await validateCourseAssessment(metaData),
    await validateCourseGoals(metaData),
    await validateCourseNetPromoterScoreSurvey(metaData),
    await validateCourseMeasurementCategory(metaData),
    await validateCourseSeniorLeaderMessage(metaData),
    await validateCoursePracticeQuestion(metaData),
  ]);
};

const validateLevelTwoCollectionExam = async (examNode, parentNodeIds, l2examErrors) => {
  const errorNodeIds = clone(parentNodeIds);

  const examId = getUid(examNode);
  if (isEmptyData(examNode.title)) {
    addErrors(errorHashKeys.level2CollectionExam, examId, errorNodeIds, [`Invalid exam found, invalid_exam_cms_id: ${examId}`]);
  }
  if (isEmptyData(examNode.questionsConnection.edges)) {
    addErrors(errorHashKeys.level2CollectionExam, examId, errorNodeIds, [`Invalid exam found, invalid_exam_cms_id: ${examId}`]);

    return false;
  }
  errorNodeIds.push(examId);

  await Promise.all(examNode.questionsConnection.edges.map(async (examQuestion) => {
    const examQuestionId = getUid(examQuestion.node);
    addNodeInErrorHash(errorHashKeys.question, examQuestionId);

    const isValidQues = await validateQuestion(examQuestionId, errorNodeIds, l2examErrors);
    return isValidQues ? null : examQuestionId;
  })).then((quesResult) => {
    const inValidQuesIds = compact(quesResult);

    if (!isEmpty(inValidQuesIds)) {
      l2examErrors.inValidQuestionIds = [
        ...l2examErrors.inValidQuestionIds,
        ...inValidQuesIds,
      ];
    }
  });
  return true;
};

const addErrorMessagesInLvl2CollExam = (examErrors, isValidExam, examId) => {
  const {
    errorMessages,
    inValidQuestionIds,
    inValidAnswerIds,
  } = examErrors;

  if (!isNil(isValidExam) && !isValidExam) {
    errorMessages.push(`Invalid exam found, invalid_exam_cms_id: ${examId}`);
  }
  if (!isEmptyData(inValidQuestionIds)) {
    errorMessages.push(`Invalid exam questions found, invalid_question_cms_ids: [${uniq(inValidQuestionIds)}]`);
  }
  if (!isEmptyData(inValidAnswerIds)) {
    errorMessages.push(`Invalid exam answer found, invalid_answer_cms_ids: [${uniq(inValidAnswerIds)}]`);
  }
};

const validateLevelTwoCollection = async (levelTwoCollectionNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  const l2CollId = getUid(levelTwoCollectionNode);
  const query = coursePreview.queries.GET_LEVEL_TWO_COLLECTION;
  const response = await apolloClient.query({ query, variables: { uid: l2CollId }, fetchPolicy: 'network-only' });

  const l2CollData = response.data.level_2;
  if (isEmptyData(l2CollData.title) || isEmptyData(l2CollData.lessonsConnection.edges)) {
    addErrors(errorHashKeys.level2Collection, l2CollId, errorNodeIds, [`Invalid level two collection found, invalid_level_two_collection_id: ${l2CollId}`]);
  } else {
    errorNodeIds.push(l2CollId);

    await Promise.all(l2CollData.lessonsConnection.edges.map(async (level1Collection) => {
      addNodeInErrorHash(errorHashKeys.level1Collection, getUid(level1Collection.node));

      const promise = await validateLevelOneCollection(level1Collection.node, errorNodeIds);
      return promise;
    }));

    if (!isEmptyData(l2CollData.examConnection.edges)) {
      const examNode = l2CollData.examConnection.edges[0].node;
      const examId = getUid(examNode);
      const l2examErrors = {
        errorMessages: [],
        inValidAssessmentExamIds: [],
        inValidQuestionIds: [],
        inValidAnswerIds: [],
      };

      addNodeInErrorHash(errorHashKeys.level2CollectionExam, examId);
      await validateLevelTwoCollectionExam(examNode, errorNodeIds, l2examErrors)
        .then((isValidL2Exam) => {
          addErrorMessagesInLvl2CollExam(l2examErrors, isValidL2Exam, examId);
          if (!isEmpty(l2examErrors.errorMessages)) {
            addErrors(errorHashKeys.assessment, examId, null, l2examErrors.errorMessages);
          }
        });
    }
  }
};

const validateLevelThreeCollection = async (levelThreeCollectionNode, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  const l3CollId = getUid(levelThreeCollectionNode);
  const query = coursePreview.queries.GET_LEVEL_THREE_COLLECTION;
  const response = await apolloClient.query({ query, variables: { uid: l3CollId }, fetchPolicy: 'network-only' });

  const l3CollData = response.data.level_3;
  if (isEmptyData(l3CollData.title) || isEmptyData(l3CollData.sub_topicsConnection.edges)) {
    addErrors(errorHashKeys.level3Collection, l3CollId, errorNodeIds, [`Invalid level three collection found, invalid_level_two_collection_id: ${l3CollId}`]);
  } else {
    errorNodeIds.push(l3CollId);

    await Promise.all(l3CollData.sub_topicsConnection.edges.map(async (level2CollectionContent) => {
      addNodeInErrorHash(errorHashKeys.level2Collection, getUid(level2CollectionContent.node));

      const promise = await validateLevelTwoCollection(level2CollectionContent.node, errorNodeIds);
      return promise;
    }));
  }
};

const validateLevelTwoCoreTopics = async (coreTopics, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  if (isEmptyData(coreTopics)) {
    addErrorsInCourseNode(['Core topics must be present in course']);
  } else {
    await Promise.all(coreTopics.map(async (level2collection) => {
      const l2collNode = level2collection.node;

      addNodeInErrorHash(errorHashKeys.level2Collection, getUid(l2collNode));
      const promise = await validateLevelTwoCollection(l2collNode, errorNodeIds);
      return promise;
    }));
  }
};

const validateLevelTwoEnrichmentTopics = async (enrichmentTopics, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  await Promise.all(enrichmentTopics.map(async (level2collection) => {
    const l2collNode = level2collection.node;

    addNodeInErrorHash(errorHashKeys.level2Collection, getUid(l2collNode));
    const promise = await validateLevelTwoCollection(l2collNode, errorNodeIds);
    return promise;
  }));
};

const validateLevelTwoCourseData = async (levelTwoCourseData) => {
  courseCmsId = getUid(levelTwoCourseData);
  addNodeInErrorHash(errorHashKeys.course, courseCmsId);
  const parentNodeIds = [courseCmsId];

  await Promise.all([
    await validateLevelCourseMetaData(levelTwoCourseData.metadata),
    await validateLevelTwoCoreTopics(levelTwoCourseData.topicsConnection.edges, parentNodeIds),
    await validateLevelTwoEnrichmentTopics(
      levelTwoCourseData.enrichment_topicsConnection.edges,
      parentNodeIds,
    ),
  ]);
};

const validateLevelThreeCoreTopics = async (coreTopics, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  if (isEmptyData(coreTopics)) {
    addErrorsInCourseNode(['Core topics must be present in course']);
  } else {
    await Promise.all(coreTopics.map(async (level3collection) => {
      const l3collNode = level3collection.node;

      addNodeInErrorHash(errorHashKeys.level3Collection, getUid(l3collNode));
      const promise = await validateLevelThreeCollection(l3collNode, errorNodeIds);
      return promise;
    }));
  }
};

const validateLevelThreeEnrichmentTopics = async (enrichmentTopics, parentNodeIds) => {
  const errorNodeIds = clone(parentNodeIds);

  await Promise.all(enrichmentTopics.map(async (level3collection) => {
    const l3collNode = level3collection.node;

    addNodeInErrorHash(errorHashKeys.level3Collection, getUid(l3collNode));
    const promise = await validateLevelThreeCollection(level3collection.node, errorNodeIds);
    return promise;
  }));
};


const validateLevelThreeCourseData = async (levelThreeCourseData) => {
  courseCmsId = getUid(levelThreeCourseData);
  addNodeInErrorHash(errorHashKeys.course, courseCmsId);
  const parentNodeIds = [courseCmsId];

  await Promise.all([
    await validateLevelCourseMetaData(levelThreeCourseData.metadata),
    await validateLevelThreeCoreTopics(levelThreeCourseData.topicsConnection.edges, parentNodeIds),
    await validateLevelThreeEnrichmentTopics(
      levelThreeCourseData.enrichment_topicsConnection.edges,
      parentNodeIds,
    ),
  ]);
};

const validateLevelCourse = async (levelCourseData, client) => {
  apolloClient = client;
  errors = [];

  if (!isEmptyData(levelCourseData.level_2_course)) {
    await validateLevelTwoCourseData(levelCourseData.level_2_course);
  } else if (!isEmptyData(levelCourseData.level_3_course)) {
    await validateLevelThreeCourseData(levelCourseData.level_3_course);
  } else {
    errors.push('Invalid Course Type');
  }

  return errors;
};
export default validateLevelCourse;
