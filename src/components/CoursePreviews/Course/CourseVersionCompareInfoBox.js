import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import VibButton from '../../shared/vib_button';

const CourseVersionCompareInfoBox = ({
  sourceCourseVersion,
  targetCourseVersion,
}) => {
  const getVersionLabel = (courseVersion) => {
    if (!isEmpty(courseVersion.courseVersionLabels)) {
      return courseVersion.courseVersionLabels.join(', ');
    }
    return courseVersion.id;
  };

  return (
    <div className="display-5 pl-2 mb-2 mt-3">
      {`Comparing: ${getVersionLabel(sourceCourseVersion)} to ${getVersionLabel(targetCourseVersion)}`}

      <VibButton
        handleSubmit={() => window.location.reload()}
        classes="text-right ml-3 px-3 py-2 float-right"
      >
        <FormattedMessage id="coursePreview.btn.cancel" />
      </VibButton>
    </div>
  );
};

CourseVersionCompareInfoBox.propTypes = {
  selectedCourseVersions: PropTypes.instanceOf(Array).isRequired,
};

export default CourseVersionCompareInfoBox;
