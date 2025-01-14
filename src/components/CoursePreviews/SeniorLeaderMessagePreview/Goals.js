import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import styles from './senior-leader-message-page.module.scss';

import GoalOption from './GoalOption';
import VibButton from '../../shared/vib_button';

const Goals = ({
  courseGoals, selectedGoals, handleContinue, handleSelectGoals, isSlmContentEmpty,
}) => {
  // If there are ≥ 3 goals for the course, the user MUST select 2 goals to proceed
  // If there are < 3 goals, the user must select 1 goal to proceed
  const canContinue = () => (
    courseGoals.length >= 3
      ? selectedGoals.length == 2
      : selectedGoals.length == 1
  );

  // If there are ≥ 3 goals for the course, the user MUST select 2 goals to proceed
  // If there are < 3 goals, the user must select 1 goal to proceed
  const checkIsGoalDisable = (goal) => {
    const isMaxSelectedGoalsCount = courseGoals.length >= 3
      ? selectedGoals.length >= 2
      : selectedGoals.length >= 1;
    const result = isMaxSelectedGoalsCount && !includes(selectedGoals, goal);
    return result || null;
  };

  const getLocaleKey = (numberOfGoals) => {
    if (numberOfGoals <= 2) {
      return 'single_goal';
    }

    return 'plural_goal';
  };

  return (
    <div className={classNames(styles['org-right-container'], 'pt-2')}>
      <div className={classNames(styles['goals-heading-text'], `mt-${isSlmContentEmpty ? 0 : 5} mb-4 pt-4 text-center`)}>
        <FormattedMessage id="goals.whatAreYouTraining" />
        {' '}
        <br />
        {' '}
        <FormattedMessage id={`goals.select.${getLocaleKey(courseGoals.length)}`} />
      </div>
      <div className={classNames(styles['option-container'], styles[`${isSlmContentEmpty ? 'only-goals-container' : ''}`])}>
        <ul className="px-0">
          {courseGoals.map((goal) => (
            <GoalOption
              key={goal.id}
              goal={goal}
              selectedGoals={selectedGoals}
              handleSelectGoals={handleSelectGoals}
              checkIsGoalDisable={checkIsGoalDisable}
            />
          ))}
        </ul>
      </div>
      <div className={classNames(styles['continue-button-container'], `justify-content-${isSlmContentEmpty ? 'center' : 'end'} d-flex mt-3 pt-4 mb-3`)}>
        <VibButton
          handleSubmit={() => handleContinue()}
          isDisabled={!canContinue()}
          variant="secondary"
          classes={classNames(styles['continue-btn'], 'btn')}
        >
          <FormattedMessage id="goals.button.submit" />
        </VibButton>
      </div>
    </div>
  );
};

Goals.propTypes = {
  courseGoals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      goal: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    }).isRequired,
  ),
  selectedGoals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
  ),
  handleContinue: PropTypes.func.isRequired,
  handleSelectGoals: PropTypes.func.isRequired,
  isSlmContentEmpty: PropTypes.bool.isRequired,
};

Goals.defaultProps = {
  courseGoals: [],
  selectedGoals: [],
};

export default Goals;
