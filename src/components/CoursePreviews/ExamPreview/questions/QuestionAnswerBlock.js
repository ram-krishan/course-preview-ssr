import React from 'react';
import PropTypes from 'prop-types';
import Progress from './ProgressBar';
import QuestionAnswer from './QuestionAnswer';

const QuestionAnswerBlock = ({
  exam,
  associatedContent,
  nextL2,
  currentExamQuestion,
  setCurrentExamQuestion,
  totalCount,
  questions,
  lastLessonPath,
  imageConnection,
  locale,
}) => {
  const position = questions.findIndex((question) => question.system.uid === currentExamQuestion.system.uid);
  return (
    <>
      <Progress
        isBeginExamPage={false}
        totalQuestionsCount={totalCount}
        position={position}
      />

      <QuestionAnswer
        position={position}
        exam={exam}
        associatedContent={associatedContent}
        currentExamQuestion={currentExamQuestion}
        setCurrentExamQuestion={setCurrentExamQuestion}
        totalQuestionsCount={totalCount}
        nextL2={nextL2}
        lastLessonPath={lastLessonPath}
        questions={questions}
        imageConnection={imageConnection}
        locale={locale}
      />
    </>
  );
};

QuestionAnswerBlock.propTypes = {
  exam: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    image: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
    totalQuestions: PropTypes.number.isRequired,
    examQuestions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        question: PropTypes.shape({
          id: PropTypes.string.isRequired,
          question: PropTypes.string.isRequired,
          questionType: PropTypes.string.isRequired,
          answers: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              answer: PropTypes.string.isRequired,
            }),
          ),
        }).isRequired,
      }),
    ),
  }).isRequired,
  currentExamQuestion: PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    question: PropTypes.shape({
      id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      questionType: PropTypes.string.isRequired,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          answer: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  }).isRequired,
  setCurrentExamQuestion: PropTypes.func.isRequired,
};

export default QuestionAnswerBlock;
