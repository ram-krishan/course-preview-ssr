
const getQuestionIndex = (assessmentExamQuestions, currentQuestion) => (
  assessmentExamQuestions.findIndex((assessmentExamQuestion) => assessmentExamQuestion.assessmentQuestion.id === currentQuestion.id)
);

const getCurrentExamQuestionId = (assessmentExamQuestions, currentQuestion) => {
  const currentExamIndex = getQuestionIndex(assessmentExamQuestions, currentQuestion);
  return assessmentExamQuestions[currentExamIndex].id;
};

const getPreviousExamQuestion = (assessmentExamQuestions, currentQuestion) => {
  const currentExamIndex = getQuestionIndex(assessmentExamQuestions, currentQuestion);
  if (currentExamIndex === 0 || currentExamIndex === -1) {
    return null;
  }
  return assessmentExamQuestions[currentExamIndex - 1].assessmentQuestion;
};

const getNextExamQuestion = (assessmentExamQuestions, currentQuestion) => {
  const currentExamIndex = getQuestionIndex(assessmentExamQuestions, currentQuestion);

  if (currentExamIndex === -1 || currentExamIndex === assessmentExamQuestions.length - 1) {
    return null;
  }

  return assessmentExamQuestions[currentExamIndex + 1].assessmentQuestion;
};

const isAnswerChanged = (currentQuestion, selectedAnswer) => (
  selectedAnswer && (
    currentQuestion.submittedAnswer === null
    || (!(currentQuestion.submittedAnswer.id === selectedAnswer.id))
  )
);

export {
  getQuestionIndex,
  getCurrentExamQuestionId,
  getPreviousExamQuestion,
  getNextExamQuestion,
  isAnswerChanged,
};
