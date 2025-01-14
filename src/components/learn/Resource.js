// "FILE NOT IN USED"
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';


import styles from './learn-page.module.scss';
import VibRouteGenerator from '../shared/vib_route_generator';

const Resource = ({ courseId, hasSeniorLeaderMessage, isOutlineDisplay }) => (
  <div className={classNames(styles['resources-block'], 'mt-3 border border-light')}>
    <div className="p-3">
      <div className={styles['course-block-heading']}><strong><h1 id="heading.resources" /></strong></div>
      {
        hasSeniorLeaderMessage ? (
          <div className={classNames(styles.small_fontsize, 'small_fontsize color-light mt-2')}>
            <Link
              to={`/t/courses/${courseId}/senior_leader_message`}
              className={styles.small_fontsize}
            >
              <strong><h1 id="learn.resource.link.messageFromYourSeniorLeader" /></strong>
            </Link>
          </div>
        ) : null
      }
      <div className={classNames(styles.small_fontsize, 'small_fontsize color-light mt-2')}>
        {
          isOutlineDisplay ? (
            <Link
              to={VibRouteGenerator.getOutlinePageUrl(courseId)}
              className={classNames(styles.small_fontsize, 'text-uppercase')}
            >
              <strong><h1 id="learn.resource.link.viewOutline" /></strong>
            </Link>
          ) : null
        }
      </div>
    </div>
  </div>
);

Resource.propTypes = {
  courseId: PropTypes.string.isRequired,
  hasSeniorLeaderMessage: PropTypes.bool.isRequired,
};

export default Resource;
