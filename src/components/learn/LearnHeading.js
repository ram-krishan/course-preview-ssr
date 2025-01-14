import React from 'react';

import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import TitleBlock from '../shared/pageTitle';
import styles from './learn-page.module.scss';

const LearnHeading = ({
  isReinforce,
  currentTopicTitle,
}) => {
  const history = useHistory();
  return (
    <>
      <TitleBlock
        pageTitle={<h1 id={`heading.${isReinforce ? 'reinforce' : 'learn'}`} />}
      />
      <div className="d-flex justify-content-between mt-1 mb-4">
        <span data-testid="current-topic-heading" className={styles['current-topic-heading']}>
          <h1 id="learn.heading.currentTopic" values={{ currentTopicTitle }} />
        </span>
      </div>
    </>
  );
};

LearnHeading.defaultProps = {
  isReinforce: false,
};

LearnHeading.propTypes = {
  isReinforce: PropTypes.bool,
  currentTopicTitle: PropTypes.string.isRequired,
};

export default LearnHeading;
