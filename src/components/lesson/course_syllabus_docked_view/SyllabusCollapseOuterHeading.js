import React from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import styles from './course-syllabus-docked-view-style.module.scss';

const SyllabusCollapseOuterHeading = ({
  item, isOpen, index,
}) => {
  const openCloseCollapse = () => {
    if (!isOpen) {
      return (
        <span data-testid="arrow-down-icon" className={classNames(styles['collapse-indication-icon'])}>
          <KeyboardArrowDownIcon />
        </span>
      );
    }
    return (
      <span data-testid="arrow-up-icon" className={classNames(styles['collapse-indication-icon'])}>
        <KeyboardArrowUpIcon />
      </span>
    );
  };

  const getLevelTwoLearnPageUrl = () => (
    <a className={styles['level-two-link']} href={item.levelTwoLearnPageUrl}>
      {item.title}
    </a>
  );

  return (
    <div data-testid="outer-heading" className={classNames(styles['title-wrapper'], 'd-flex align-items-start')}>
      <span className={styles['icon-wp-spn']}>
        {openCloseCollapse()}
      </span>
      <span className={classNames(styles['sequence-number-spn'], 'pr-1')}>
        {index + 1}
        .
      </span>
      <div className="d-flex">
        <span>
          {(item.__typename === 'LevelTwoCollection' && !isEmpty(item.levelTwoLearnPageUrl)) ? getLevelTwoLearnPageUrl() : item.title}
        </span>
      </div>
    </div>
  );
};

SyllabusCollapseOuterHeading.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    title: PropTypes.string,
    levelTwoLearnPageUrl: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

export default SyllabusCollapseOuterHeading;
