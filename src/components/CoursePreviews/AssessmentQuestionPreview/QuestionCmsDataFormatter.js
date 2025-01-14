import { isEmpty } from 'lodash';


const nodes = (item) => (
  item.edges.map((edge) => edge.node)
);
const getFormattedTitle = (node) => (
  isEmpty(node.display_title) ? node.title : node.display_title
);

const getId = (data) => data.system.uid;

const getFormattedAnswers = (answersConnection) => {
  const answers = nodes(answersConnection);
  if (isEmpty(answers)) return null;

  return answers.map((answer) => ({
    id: getId(answer),
    title: answer.answer_option || answer.title,
    weight: answer.answer_weight,
    __typename: 'AssessmentAnswer',
  }));
};

const getFormattedQuestion = (questionData) => {
  const { assessment_question: assessmentQuestion } = questionData;
  if (isEmpty(assessmentQuestion)) {
    return null;
  }

  return {
    id: getId(assessmentQuestion),
    question: assessmentQuestion.question,
    answers: getFormattedAnswers(assessmentQuestion.answersConnection),
    __typename: 'AssessmentQuestion',
  };
};

const getAssessmentExams = (assessments, assessmentExam) => {
  const exams = nodes(assessments.examsConnection);
  const currentExamId = getId(assessmentExam);
  return exams.map((exam) => ({
    id: getId(exam),
    title: getFormattedTitle(exam),
    percentageOfQuestionCompleted: 0,
    status: getId(exam) === currentExamId ? 'inProgress' : 'locked',
    __typename: 'AssessmentExam',
  }));
};

const getCurrentAssessmentExamInfo = (assessments, assessmentExam) => {
  return {
    id: getId(assessmentExam),
    title: getFormattedTitle(assessmentExam),
    percentageOfQuestionCompleted: 0,
    status: 'inProgress',
    __typename: 'AssessmentExam',
  };
};

const getExamQuestionFormattedData = (assessmentContentData, examCmsData, questionContentCmsData) => {
  const { assessment_exam: assessmentExam } = examCmsData;
  const { assessments } = assessmentContentData;
  const { totalCount } = examCmsData.assessment_exam.questionsConnection;
  const currentAssessmentExamInfo = getCurrentAssessmentExamInfo(assessments, assessmentExam);
  const assessmentExams = getAssessmentExams(assessments, assessmentExam);

  return {
    assessment: {
      title: getFormattedTitle(assessments),
      assessmentCurrentExam: currentAssessmentExamInfo,
    },
    exam: {
      id: getId(assessmentExam),
      title: getFormattedTitle(assessmentExam),
      totalNoOfQuestions: totalCount,
    },
    question: getFormattedQuestion(questionContentCmsData),
    validExams: assessmentExams,
  };
};

export default getExamQuestionFormattedData;
