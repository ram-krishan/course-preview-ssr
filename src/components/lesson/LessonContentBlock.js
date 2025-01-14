// un-used file
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image } from 'react-bootstrap';

import styles from './lesson-page.module.scss';

function LessonContentBlock({ lessonPageContent }) {
  return (
    <div className={classNames(styles['lesson-page-content-container'], 'mt-2')}>
      <div className={styles.title}>
        { lessonPageContent.title }
      </div>
      {
        lessonPageContent.image
          ? (
            <div className={styles['lesson-page-img-wrapper']}>
              <Image
                src={lessonPageContent.image.url}
                alt={lessonPageContent.image.title}
                className={classNames(styles['lesson-page-image'], 'mt-2')}
              />
            </div>
          )
          : null
      }
    </div>
  );
}

LessonContentBlock.propTypes = {
  lessonPageContent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default LessonContentBlock;
