// Un-used component
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

const Correct = () => (
  <>
    <div className={classNames(styles['correct-label-container'])}>
      <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h5 mb-0" />
      <span className={classNames(styles['correct-label'])}>Correct</span>
    </div>
  </>
);

export default Correct;
