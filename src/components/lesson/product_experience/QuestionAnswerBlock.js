import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import MoodBadIcon from '@material-ui/icons/MoodBad';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import MoodOutlinedIcon from '@material-ui/icons/MoodOutlined';
import { NoImageAvailableImg as Neutral } from '../../shared/vib_images';
import styles from '../../my_courses/course-page.module.scss';

const QuestionAnswerBlock = ({
  productExperienceSurvey,
  handleAnswerSelect,
}) => {
  const { surveyQuestions } = productExperienceSurvey;

  const getIcon = (value) => {
    switch (value) {
      case 0: {
        return <MoodBadIcon />;
      }
      case 1: {
        return <SentimentVeryDissatisfiedIcon />;
      }
      case 2: {
        return <img src={Neutral} alt={`${Neutral}`} />;
      }
      case 3: {
        return <SentimentSatisfiedOutlinedIcon />;
      }
      case 4: {
        return <MoodOutlinedIcon />;
      }
      default: return new Error(`invalid option value text: ${value}`);
    }
  };
  return (
    <>
      {surveyQuestions.map((question) => (
        <div data-testid="prod-question-answer-container" key={question.id} className="mb-5">
          <h4 data-testid={`prod-question-${question.id}`} className={classNames(styles['feedback-question'], 'mb-3')}>{question.title}</h4>
          <div className="d-flex flex-wrap justify-content-center">
            {question.surveyAnswers.map((answer) => (
              <div key={answer.id} className={styles['user-choice-block']}>
                <input
                  data-testid={`input-${answer.id}`}
                  type="radio"
                  name={`${question.id}`}
                  value={`${answer.id}`}
                  onClick={(event) => handleAnswerSelect(event)}
                />
                <div className={styles['inner-content']}>
                  {getIcon(answer.value)}
                  <p data-testid={`answer-title-${answer.id}`}>{answer.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

QuestionAnswerBlock.propTypes = {
  productExperienceSurvey: PropTypes.shape({
    surveyQuestions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      question: PropTypes.string,
    })).isRequired,
  }).isRequired,
  handleAnswerSelect: PropTypes.func.isRequired,
};

export default QuestionAnswerBlock;
