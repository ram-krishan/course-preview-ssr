import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty,
} from 'lodash';
import { formatCollection } from '../../Course/shared';

import QuestionAnswerBlock from './QuestionAnswerBlock';
import useSuperScript from '../../../shared/hooks/useSuperScript';

const QuestionBody = ({
  lastLessonPath,
  exam,
  associatedContent,
  nextL2,
  questionCmsId,
  locale,
}) => {
  useSuperScript();
  const { questionsConnection, imageConnection } = exam;
  const questions = formatCollection(questionsConnection);
  const { totalCount } = questionsConnection;
  const [currentExamQuestion, setCurrentExamQuestion] = useState(null);

  if (isEmpty(currentExamQuestion)) {
    let que = null;
    if (!isEmpty(questionCmsId)) {
      que = questions.find((question) => question.system.uid === questionCmsId);
    } else {
      [que] = questions;
    }
    setCurrentExamQuestion(que);
  }
  return (
    <QuestionAnswerBlock
      exam={exam}
      associatedContent={associatedContent}
      nextL2={nextL2}
      currentExamQuestion={currentExamQuestion}
      setCurrentExamQuestion={setCurrentExamQuestion}
      totalCount={totalCount}
      questions={questions}
      lastLessonPath={lastLessonPath}
      imageConnection={imageConnection}
      locale={locale}
    />
  );
};
QuestionBody.propTypes = {
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
      }),
    ),
  }).isRequired,
  levelTwoCollection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    levelTwoLevelOneCollections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        position: PropTypes.number.isRequired,
        levelOneCollection: PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  lastLessonPath: PropTypes.string.isRequired,
};

export default QuestionBody;
