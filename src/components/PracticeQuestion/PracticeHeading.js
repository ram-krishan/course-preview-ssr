import React from 'react';
import classNames from 'classnames';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styles from './practice-page.module.scss';

const PracticeHeading = ({ courseTitle, measurementCategoryTitle }) => (
  <Col lg={12} className="px-0">
    <div>
      <h1 data-testid="page-heading" className={classNames(styles['practice-heading'], 'color-black mb-0')}>
        <FormattedMessage id="practicePage.activities.heading.practice" />
      </h1>
      <p data-testid="category-heading" className={classNames(styles['category-heading'], 'mb-0')}>
        {measurementCategoryTitle}
      </p>
    </div>
  </Col>
);

PracticeHeading.defaultProps = {
  courseTitle: '',
  measurementCategoryTitle: '',
};

PracticeHeading.propTypes = {
  courseTitle: PropTypes.string,
  measurementCategoryTitle: PropTypes.string,
};
export default PracticeHeading;
