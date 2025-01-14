import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import styles from './question.module.scss';
import TitleBlock from '../../../shared/pageTitle';
import lessonPageStyles from '../../../lesson/lesson-page.module.scss';

const Heading = ({
  lastLessonPath,
  levelTwoCollectionTitle,
  contentType,
}) => {
  const getTopicHeading = () => (contentType === 'core'
    ? <FormattedMessage id="heading.learn" />
    : <FormattedMessage id="heading.reinforce" />);

  return (
    <Row className="my-3 align-items-center">
      <Col md={8} className={classNames(lessonPageStyles['heading-container'])}>
        <TitleBlock
          label={getTopicHeading()}
          topicLabel={levelTwoCollectionTitle}
          topTxtClassNames={styles['topic-title']}
          topicLabelClassNames={styles['topic-label-styles']}
        />
      </Col>

      <Col md={4}>
        <div className="d-flex justify-content-end">
          <Link to={lastLessonPath}>
            <Button variant="default" className={classNames(styles['back-btn'], 'small_fontsize')}>
              <FormattedMessage id="course.exam.button.backToLesson" />
            </Button>
          </Link>
        </div>
      </Col>
    </Row>
  );
};

Heading.propTypes = {
  lastLessonPath: PropTypes.string.isRequired,
  levelTwoCollectionTitle: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
};

export default Heading;
