import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { isEmpty } from 'lodash';
import styles from './course-syllabus-docked-view-style.module.scss';
import { getItemClassName } from '../../shared/ProgressUtility';

const SyllabusCollapseInnerHeading = ({
  item,
}) => {
  const statsValue = {
    status: 'open',
  };
  const getStatus = (objData) => (objData.status ? objData : statsValue);
  const getLevelTwoLearnPageUrl = () => (
    <a className={styles['level-two-link']} href={item.levelTwoLearnPageUrl}>
      {item.title}
    </a>
  );

  return (
    <div data-testid="inner-heading" className={classNames(styles['title-wrapper'], styles[getItemClassName(getStatus(item))], 'd-flex')}>
      <span data-testid="up-arrow-icon" className={classNames(styles['collapse-inner-indication-icon'], styles.chevron)}>
        <KeyboardArrowUpIcon />
      </span>
      <div className={classNames(styles['inner-heading-wp'], 'd-flex ml-5')}>
        <span className="d-flex pr-1">
          {item.indexLabel}
        </span>
        <div className="d-flex justify-content-between w-100 align-items-center">
          <span className="d-flex align-items-center">
            {(item.__typename === 'LevelTwoCollection' && !isEmpty(item.levelTwoLearnPageUrl)) ? getLevelTwoLearnPageUrl() : item.title}
          </span>
        </div>
      </div>
    </div>
  );
};

SyllabusCollapseInnerHeading.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    title: PropTypes.string,
    indexLabel: PropTypes.string,
    levelTwoLearnPageUrl: PropTypes.string,
    __typename: PropTypes.string,
  }).isRequired,
};

export default SyllabusCollapseInnerHeading;
