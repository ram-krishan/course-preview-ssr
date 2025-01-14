import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import CourseLearningResources from './CourseLearningResources';
import useSuperScript from '../../shared/hooks/useSuperScript';

const ToolsContent = ({ learningResourceFormattedData }) => {
  useSuperScript();
  return (
    <Col md={12} className="pb-4">
      {
          <CourseLearningResources
            learningResourcesCourse={learningResourceFormattedData}
            key={learningResourceFormattedData.id}
          />
      }
    </Col>
  );
};

ToolsContent.propTypes = {
  learningResourceFormattedData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  perPage: PropTypes.number.isRequired,
};
export default ToolsContent;
