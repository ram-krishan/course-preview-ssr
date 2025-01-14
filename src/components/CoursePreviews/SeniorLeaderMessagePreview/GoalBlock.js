'use client'

import React, { useState } from 'react';
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types';
import Goals from './Goals';
import SelectedGoals from './SelectedGoals';

const GoalBlock = ({
  goals,
  isSlmContentEmpty,
}) => {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [showGoalSelectedSuccessMessage, setShowGoalSelectedSuccessMessage] = useState(false);

  const handleSelectGoals = (event, goal) => {
    if (event.target.checked) {
      setSelectedGoals([...selectedGoals, goal]);
    } else {
      setSelectedGoals(selectedGoals.filter((selectedGoal) => selectedGoal.id !== goal.id));
    }
  };

  const handleContinue = () => {
    setShowGoalSelectedSuccessMessage(true);
  };

  if (!isEmpty(selectedGoals) && showGoalSelectedSuccessMessage) {
    return (
      <SelectedGoals
        goals={selectedGoals}
        showGoalSelectedSuccessMessage={showGoalSelectedSuccessMessage}
        isSlmContentEmpty={isSlmContentEmpty}
      />
    );
  }

  return (
    <Goals
      handleContinue={handleContinue}
      handleSelectGoals={handleSelectGoals}
      selectedGoals={selectedGoals}
      courseGoals={goals}
      isSlmContentEmpty={isSlmContentEmpty}
    />
  );
};

GoalBlock.propTypes = {
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  ).isRequired,
  isSlmContentEmpty: PropTypes.bool.isRequired,
};
export default GoalBlock;
