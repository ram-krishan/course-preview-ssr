import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { FormattedMessage } from 'react-intl';

import AlertMessage from '../../../components/shared/AlertMessage';
import styles from './senior-leader-message-page.module.scss';
import Answer from '../../shared/QuestionAnswers/Answer';
import VibButton from '../../shared/vib_button';

const SelectedGoals = ({ goals, showGoalSelectedSuccessMessage, isSlmContentEmpty }) => {
  // const handleReturnToNextActivity = () => {
  //   window.location.href = '/learn';
  // };

  const getLocaleKey = (numberOfGoals) => {
    if (numberOfGoals == 1){
      return 'single_goal'
    }
    else
    {
      return 'plural_goal'
    }
  }

  const successMessage = () => (
    <>
      <span className={classNames(styles['success-message-icon'])}><CheckCircleOutlineIcon /></span>
      <span className={classNames(styles['success-message'])}>
        <strong><FormattedMessage id="goals.heading.success" /></strong>
        <FormattedMessage
          id={`goals.success.message.${getLocaleKey(goals.length)}`}
          values={{
            goalsLength: goals.length,
          }}
        />
      </span>
    </>
  );

  return (
    <div className={classNames(styles['org-right-container'], 'pt-3')}>
      <div className={classNames(styles['goals-heading-text'], `mt-${isSlmContentEmpty ? 0 : 5} mb-4 pt-4 text-center`)}>
        <FormattedMessage id="goals.selectedGoalsMessage" />
      </div>
      {
        showGoalSelectedSuccessMessage
          ? (
            <AlertMessage
              alertType="success"
              customClass={styles['select-goal-success-message']}
              message={successMessage()}
            />
          )
          : null
      }
      <div className={classNames(styles['option-container'], styles[`${isSlmContentEmpty ? 'only-goals-container' : ''}`])}>
        <div className={classNames(styles['selected-options-container'])}>
          {
            goals.map((goal) => (
              <Answer
                key={goal.id}
                answer={goal}
                optionId={goal.id}
                hideCheckBox
                showFeedback={false}
              />
            ))
            }
        </div>
        <div className={classNames('d-flex justify-content-end mt-5 pt-3 mb-3')}>
          <VibButton
            handleSubmit={() => {}}
            variant="secondary"
            classes={classNames(styles['continue-btn'])}
          >
            <FormattedMessage id="goals.button.nextActivity" />
          </VibButton>
        </div>
      </div>
    </div>
  );
};

SelectedGoals.propTypes = {
  goals: PropTypes.instanceOf(Array).isRequired,
  showGoalSelectedSuccessMessage: PropTypes.bool.isRequired,
  isSlmContentEmpty: PropTypes.bool.isRequired,
};

export default SelectedGoals;
