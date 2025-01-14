import React from 'react';
import PropTypes from 'prop-types';

import Answer from '../../shared/QuestionAnswers/Answer';

const GoalOption = ({
  goal, checkIsGoalDisable, selectedGoals, handleSelectGoals,
}) => {
  const isGoalSelected = selectedGoals
    .filter((selectedGoal) => selectedGoal.id === goal.id).length > 0;

  const disableAnswerOptions = checkIsGoalDisable(goal) !== null;

  return (
    <Answer
      key={goal.id}
      answer={goal}
      optionId={goal.id}
      isChecked={isGoalSelected}
      toggleCheckbox={(event) => handleSelectGoals(event, goal)}
      showFeedback={false}
      disableAnswerOptions={disableAnswerOptions}
    />
  );
};

GoalOption.propTypes = {
  goal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  checkIsGoalDisable: PropTypes.func.isRequired,
  selectedGoals: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }).isRequired).isRequired,
  handleSelectGoals: PropTypes.func.isRequired,
};

export default GoalOption;
