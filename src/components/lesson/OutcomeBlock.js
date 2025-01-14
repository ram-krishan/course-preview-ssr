import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './lesson-page.module.scss';

const OutcomeBlock = ({ outcome }) => (
  <div className={classNames(styles['outcome-block'], 'p-4')}>
    <div className={classNames(styles['outcome-title'])}>{outcome.title}</div>
    <div className={classNames(styles['outcome-desc'], 'mt-2')}>
      {outcome.description}
    </div>
  </div>
);

OutcomeBlock.propTypes = {
  outcome: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};
export default OutcomeBlock;
