import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';
import styles from './apply-page.module.scss';
import { DownloadIcon } from '../../shared/vib_icons';
import useSuperScript from '../../shared/hooks/useSuperScript';

const LearningResourceContentContainer = ({ courseLearningResource, courseId }) => {
  useSuperScript();
  const [isOverFlow, setIsOverFlow] = useState(false);

  const handleMouserHover = (event) => {
    const element = event.target;
    const isOverFlowing = element.clientWidth < element.scrollWidth
    || element.clientHeight < element.scrollHeight;

    setIsOverFlow(isOverFlowing);
  };

  return (
    <div className={classNames(styles['content-container'], 'p-0')}>
      <div className="d-flex">
        <h6 className={styles['content-title']}>
          {courseLearningResource.title}
        </h6>
        <div className={styles['download-icon-form']}>
          <a href={courseLearningResource.resourceUrl} rel="noreferrer" className={styles['download-icon-wrapper']} target="_blank">
            <DownloadIcon fillColor="rgba(78, 30, 143, 1)" />
          </a>
        </div>
      </div>
      <div className={classNames(styles['block-with-text'])}>
        <div className={classNames(styles['content-description'])}>
          <div
            data-for={`learning-text-${courseLearningResource.id}`}
            data-tip
            dangerouslySetInnerHTML={{ __html: courseLearningResource.descriptionText }}
            onMouseOver={handleMouserHover}
            onFocus={() => {}}
          />
          <ReactTooltip className={classNames(styles['tooltip-text'], `${isOverFlow ? '' : 'd-none'}`)} id={`learning-text-${courseLearningResource.id}`} aria-haspopup="true" place="bottom" type="light" effect="float" width="20%" height="auto" html>
            {courseLearningResource.descriptionText }
          </ReactTooltip>
        </div>
      </div>
    </div>
  );
};

LearningResourceContentContainer.propTypes = {
  courseLearningResource: PropTypes.shape({
    node: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.string,
      fileType: PropTypes.string,
      image: PropTypes.string,
      lessonLink: PropTypes.string,
      isLessonLocked: PropTypes.bool,
      status: PropTypes.string,
      learningResource: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
  courseId: PropTypes.string.isRequired,
};
export default LearningResourceContentContainer;
