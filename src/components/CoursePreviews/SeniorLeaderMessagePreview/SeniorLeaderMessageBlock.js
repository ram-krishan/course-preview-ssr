import React from 'react';
import { Col } from 'react-bootstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import styles from './senior-leader-message-page.module.scss';
import VideoAssociatedContentWrapper from '../../lesson/shared/VideoAssociatedContentWrapper';
import VibButton from '../../shared/vib_button';

const SeniorLeaderMessageBlock = ({
  textBlock,
  videoBlockContent,
  isGoalsEmpty,
}) => {
  const createMarkup = (html) => ({ __html: html });

  const videoBlock = videoBlockContent.video;

  const videoJsOptions = () => (
    {
      poster: videoBlock.thumbnailUrl,
      controls: true,
      sources: [{
        src: videoBlock.fileUrl,
        type: videoBlock.contentType,
      }],
      width: '650',
      height: '450',
    }
  );

  const isVideoContentPresent = () => !isEmpty(videoBlock) && videoBlock.fileUrl !== null;

  const videoContent = () => (
    <VideoAssociatedContentWrapper
      content={videoBlock}
      videoOptions={videoJsOptions()}
      subtitles={videoBlock.subtitles}
    />
  );

  const textContent = () => (
    !isEmpty(textBlock)
      ? (
        <div className={classNames(styles['bottom-description'], 'mt-4')}>
          <div dangerouslySetInnerHTML={
            createMarkup(textBlock)
          }
          />
        </div>
      )
      : null
  );

  const videoOrTextContent = () => (
    isVideoContentPresent()
      ? videoContent()
      : textContent()
  );

  return (
    <Col lg={isGoalsEmpty ? 12 : 7}>
      <div className={classNames(styles['org-left-container'])}>
        <div className={classNames(styles['goals-heading-text'], 'mt-4 mb-3')}>
          <FormattedMessage id="goals.heading.videoMessage" />
        </div>
        { videoOrTextContent() }
      </div>

      {
        isGoalsEmpty
          ? (
            <Col lg={12} className={classNames('d-flex justify-content-end mt-5 pt-3 mb-3')}>
              <VibButton
                handleSubmit={() => {}}
                variant="secondary"
                classes={classNames(styles['continue-btn'])}
              >
                <FormattedMessage id="goals.button.nextActivity" />
              </VibButton>
            </Col>
          )
          : null
      }
    </Col>
  );
};

export default SeniorLeaderMessageBlock;

SeniorLeaderMessageBlock.defaultProps = {
  videoBlockContent: {},
  textBlock: null,
};

SeniorLeaderMessageBlock.propTypes = {
  videoBlockContent: PropTypes.shape({
    _typename: PropTypes.string,
    video: PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string,
      fileUrl: PropTypes.string.isRequired,
      contentType: PropTypes.string.isRequired,
      subtitles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })),
    }),
  }),
  textBlock: PropTypes.string,
};
