import React from 'react';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Media } from 'react-bootstrap';


import styles from './course-syllabus-docked-view-style.module.scss';
import { getItemSvgSrc } from '../../shared/ProgressUtility';

const LeaderMessageContainer = ({ actionPlanTasks, isCourseSyllabusSideView }) => {
  // VIB-1670: If Sentiment Survey 1 is enabled for the course and has not been taken, Leader Message would not be selectable
  const isLeaderMessageDisabled = () => {
    const sentimentSurveyOne = find(actionPlanTasks, { key: 'sentiment_survey_instance_one' });
    return sentimentSurveyOne && sentimentSurveyOne.status !== 'completed';
  };

  const getLeaderMessageTitleClass = () => classnames(
    styles['leader-message-link'],
    isLeaderMessageDisabled && isCourseSyllabusSideView ? styles['leader-message-link-docked-view'] : '',
    isLeaderMessageDisabled() ? styles.disabled : '',
  );

  const getLeaderMessageActionPlanTask = () => find(
    actionPlanTasks,
    { key: 'message_from_senior_leader' },
  );

  const getLeaderMessageStatus = () => {
    const leaderMessageTaskStatus = getLeaderMessageActionPlanTask().status;
    if (leaderMessageTaskStatus === 'open' || leaderMessageTaskStatus === 'inProgress') {
      return 'inProgress';
    }
    return leaderMessageTaskStatus;
  };

  return (
    <Media className={`d-flex ${styles['leader-message-container']}`}>
      {!isCourseSyllabusSideView
        ? (
          getItemSvgSrc({
            itemData: { status: getLeaderMessageStatus() },
            tickMarkIconColor: '#21154A',
          })
        )
        : null}

      <Media.Body className="d-flex justify-content-between">
        <span>
          {isLeaderMessageDisabled()
            ? (
              <span className={getLeaderMessageTitleClass()}>
                <h1 id="heading.leaderMessage" />
              </span>
            ) : (
              <Link
                to={getLeaderMessageActionPlanTask().url}
                className={getLeaderMessageTitleClass()}
              >
                <h1 id="heading.leaderMessage" />
              </Link>
            )}
        </span>
      </Media.Body>
    </Media>
  );
};

LeaderMessageContainer.propTypes = {
  actionPlanTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string,
      status: PropTypes.string,
      title: PropTypes.string,
      url: PropTypes.string,
    }),
  ).isRequired,
};

export default LeaderMessageContainer;
