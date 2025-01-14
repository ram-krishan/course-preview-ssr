import { getPreviousExamQuestion, getNextExamQuestion } from './utils';

const updatedExamQuestionWithNewAnswer = (assessmentExamQuestions, currentQuestion, updatedAnswer) => (
  assessmentExamQuestions.map((assessmentExamQuestion) => {
    if (assessmentExamQuestion.assessmentQuestion.id === currentQuestion.id) {
      return {
        ...assessmentExamQuestion,
        assessmentQuestion: {
          ...assessmentExamQuestion.assessmentQuestion,
          submittedAnswer: updatedAnswer,
        },
      };
    }
    return assessmentExamQuestion;
  })
);

const updateQuestionWithNewAnswer = (state, actionPayload) => {
  const { isAnswerChanged, updatedAnswer } = actionPayload;
  if (!isAnswerChanged) {
    return state;
  }

  return {
    ...state,
    currentQuestion: {
      ...state.currentQuestion,
      submittedAnswer: updatedAnswer,
    },
    assessmentExamQuestions: updatedExamQuestionWithNewAnswer(state.assessmentExamQuestions, state.currentQuestion, updatedAnswer),
  };
};

const updatedState = (state, actionPayload) => {
  const nextExamQuestion = getNextExamQuestion(state.assessmentExamQuestions, state.currentQuestion);
  const updateQuestionWithNewAnswerState = {...updateQuestionWithNewAnswer(state, actionPayload)}

  return {
    ...state,
    ...updateQuestionWithNewAnswerState,
    currentQuestion: nextExamQuestion,
    previousQuestion: updateQuestionWithNewAnswerState.currentQuestion,
    nextQuestion: getNextExamQuestion(updateQuestionWithNewAnswerState.assessmentExamQuestions, nextExamQuestion),
  };
};


const examQuestionAnswerInitialState = (courseAssessmentAttempt) => {
  const {
    courseAssessment: {
      assessment: {
        id: assessmentId,
        assessmentCurrentExam: {
          assessmentExamCurrentQuestion,
          assessmentExamQuestions,
          id: assessmentExamId,
        },
      },
    },
  } = courseAssessmentAttempt;

  const validExamQuestions = assessmentExamQuestions.filter(assessmentExamQuestion => assessmentExamQuestion.assessmentQuestion.isValid);
  if (!assessmentExamCurrentQuestion) {
    return {
      assessmentExamQuestions: validExamQuestions,
      currentQuestion: null,
      assessmentId,
      previousQuestion: validExamQuestions[validExamQuestions.length - 1],
      nextQuestion: null,
      assessmentExamId,
    };
  }

  const previousQuestion = getPreviousExamQuestion(validExamQuestions, assessmentExamCurrentQuestion);
  const nextQuestion = getNextExamQuestion(validExamQuestions, assessmentExamCurrentQuestion);
  return {
    assessmentExamQuestions: validExamQuestions,
    currentQuestion: assessmentExamCurrentQuestion,
    assessmentId,
    previousQuestion,
    nextQuestion,
    assessmentExamId,
  };
};


const assessmentExamReducer = (state, action) => {
  switch (action.type) {
    case 'ON_CONTINUE_BUTTON_CLICK':
      return updatedState(state, action.payload);

    case 'ON_BACK_TO_PREVIOUS_BUTTON_CLICK':
      return {
        ...state,
        currentQuestion: state.previousQuestion,
        previousQuestion: null,
        nextQuestion: state.currentQuestion,
      };
    default: {
      return state;
    }
  }
};

export { examQuestionAnswerInitialState, assessmentExamReducer };
