import React, {memo} from 'react';
import { Link } from 'react-router-dom';
import {contentStackObjectNameMappings} from './utils';

import Loader from '../../../shared/Loader';

const NameCell = memo(({ objectType, parentId, name, isLoadingData }) => {
  const getFormattedName = () => {
    if(parentId) {
      const objectMapping = contentStackObjectNameMappings(objectType)
      return (
        <span>
          <span className="badge badge-info mr-2">
            { objectMapping.tag }
          </span>
          { name }

          {/* { getInValidBadgeHtml(value) } */}
          {/* { getDiffIndicator(value) } */}

          {isLoadingData && (
            <Loader height="0px" topWrapperClassName="d-inline-flex" />
          )}
        </span>
      );
    }

    return (
      <>
        { name }
        {/* { getInValidBadgeHtml(value) } */}
      </>
    );
  };

  return getFormattedName();
});

export default NameCell;
