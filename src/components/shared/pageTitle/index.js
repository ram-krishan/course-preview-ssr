'use client'

import React from 'react';
import { Col } from 'react-bootstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './title.module.scss';
import useSuperScript from '../hooks/useSuperScript';

const TitleBlock = ({
  topicLabel,
  label,
  pageTitle,
  courseTitle,
  topTxtClassNames,
  middleTxtClassNames,
  bottomTxtClassNames,
  topicLabelClassNames,
}) => {
  useSuperScript();
  return (
    <Col sm={12} className="pl-0">
      {topicLabel ? (
        <p data-testid="topic-label" className={classNames(topicLabelClassNames, ' mb-0')}>{topicLabel}</p>
      ) : null}

      {label ? (
        <span data-testid="topic-small-text" className={classNames(styles['top-small-txt'], topTxtClassNames)}>{label}</span>
      ) : null}

      {pageTitle
        ? (
          <h3 data-testid="page-title" className={classNames(styles['title-heading'], middleTxtClassNames)}>{pageTitle}</h3>
        ) : null}

      {courseTitle ? (
        <p data-testid="course-title" className={classNames(styles['course-title'], bottomTxtClassNames)}>{courseTitle}</p>
      ) : null}
    </Col>
  );
};

TitleBlock.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Object),
  ]),
  topicLabel: PropTypes.string,
  topTxtClassNames: PropTypes.string,
  bottomTxtClassNames: PropTypes.string,
  middleTxtClassNames: PropTypes.string,
  topicLabelClassNames: PropTypes.string,
  pageTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  courseTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

TitleBlock.defaultProps = {
  topicLabel: '',
  label: '',
  topTxtClassNames: '',
  bottomTxtClassNames: '',
  middleTxtClassNames: '',
  topicLabelClassNames: '',
  courseTitle: '',
  pageTitle: '',
};
export default TitleBlock;
