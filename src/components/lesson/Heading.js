import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import LessonPageBreadcrumb from '../shared/lesson_page_breadcrumbs';

const Heading = ({
  currentPage,
}) => (
  <div className="mt-3">
    { !isEmpty(currentPage)
      ? (
        <LessonPageBreadcrumb breadcrumbItems={currentPage.pageProgress.breadcrumbItems} />
      )
      : null}
  </div>
);

Heading.defaultProps = {
  currentPage: null,
};


Heading.propTypes = {
  currentPage: PropTypes.instanceOf(Object),
};

export default Heading;
