import React from 'react';
import PropTypes from 'prop-types';
import { Media } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';

import styles from './course-syllabus-docked-view-style.module.scss';
import { getItemClassName } from '../../shared/ProgressUtility';


const ListItemComponent = ({
  targetObject,
  targetTitleUrl,
  listIndex,
  showLinkOnTitle,
  isLevelTwoCollectionCourse,
}) => {
  const history = useHistory();

  const getLiClasses = () => (
    `d-flex align-items-baseline ${classNames(styles[getItemClassName(targetObject)], targetObject.status === 'inProgress' ? styles['current-lesson'] : '')}`
  );

  const handleLessonTitleClick = (event) => {
    event.preventDefault();
    history.push({
      pathname: targetTitleUrl,
      state: { isL1CollectionRequestFromSyllabus: true },
    });
  };

  return (
    <Media
      data-testid="list-item-component"
      key={targetObject.id}
      as="li"
      className={getLiClasses()}
    >
      <span className={classNames(styles['no-indicator-spn'], targetObject.status === 'completed' ? styles['completed-lesson'] : '', isLevelTwoCollectionCourse ? styles['level-two-collection-course'] : '', window.location.pathname === targetTitleUrl ? styles['active-li'] : '')}>
        { listIndex >= 0 ? listIndex + 1 : null }
      </span>
      <Media.Body className="d-flex justify-content-between">
        <span>
          {
            showLinkOnTitle && targetObject.status !== 'open'
              ? (
                <Link to="#" className={classNames(styles['jump-to-link'])} onClick={handleLessonTitleClick}>
                  {targetObject.title}
                </Link>
              )
              : targetObject.title
            }
        </span>
      </Media.Body>
    </Media>
  );
};


ListItemComponent.defaultProps = {
  targetTitleUrl: null,
  listIndex: null,
  isLevelTwoCollectionCourse: false,
};

ListItemComponent.propTypes = {
  targetObject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  targetTitleUrl: PropTypes.string,
  listIndex: PropTypes.number,
  showLinkOnTitle: PropTypes.bool.isRequired,
  isLevelTwoCollectionCourse: PropTypes.bool,
};

export default ListItemComponent;
