import React from 'react';
import PropTypes from 'prop-types';
import { Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './learn-page.module.scss';
import { getItemSvgSrc, getItemClassName } from '../shared/ProgressUtility';


const ListItemComponent = ({
  targetObject, wrapperObject, targetTitleUrl, listIndex, showLinkOnTitle,
}) => {
  const getLiClasses = () => (
    `d-flex align-items-center ${classNames(styles[getItemClassName(targetObject)], targetObject.status === 'inProgress' ? styles['current-lesson'] : '')}`
  );

  return (
    <Media
      key={targetObject.id}
      as="li"
      className={getLiClasses()}
    >
      {
        wrapperObject.status === 'inProgress' && targetObject.status === 'completed'
          ? (
            <span className={styles['no-indicator-spn']}>
              { listIndex >= 0 ? listIndex + 1 : null }
            </span>
          )
          : getItemSvgSrc({
            itemData: targetObject,
            classes: 'mr-2',
            iconHeight: '18px',
            iconWidth: '18px',
            tickMarkIconColor: '#21154A',
          })
      }
      <Media.Body className="d-flex justify-content-between">
        <span>
          {
            showLinkOnTitle && targetObject.status !== 'open'
              ? (
                <Link data-testid="jump-link" to={targetTitleUrl} className={classNames(styles['jump-to-link'])}>
                  {targetObject.title}
                </Link>
              )
              : (
                <span className={classNames(styles['locked-link'])}>
                  {targetObject.title}
                  {' '}
                </span>
              )
            }
        </span>
      </Media.Body>
    </Media>
  );
};


ListItemComponent.defaultProps = {
  targetTitleUrl: null,
  wrapperObject: null,
  listIndex: 0,
};

ListItemComponent.propTypes = {
  targetObject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  wrapperObject: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    status: PropTypes.string,
  }),
  targetTitleUrl: PropTypes.string,
  listIndex: PropTypes.number,
  showLinkOnTitle: PropTypes.bool.isRequired,
};

export default ListItemComponent;
