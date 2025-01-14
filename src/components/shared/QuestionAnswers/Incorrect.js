//un-used component
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';

const Incorrect = () => (
  <>
    <div className={classNames(styles['incorrect-label-container'])}>
      <FontAwesomeIcon icon={faTimesCircle} className="mr-2 h5 mb-0" />
      <span className={classNames(styles['incorrect-label'])}>Incorrect</span>
    </div>
  </>
);

export default Incorrect;
