import React, {memo} from 'react';
import { Link } from 'react-router-dom';
import {contentStackObjectNameMappings} from './utils';

const CmsCell = memo(({objectType, objectId, locale}) => {
  if (!objectType) {
    return null;
  }

  const objectMapping = contentStackObjectNameMappings(objectType);
  return (
    <Link to={{ pathname: `${process.env.REACT_APP_CONTENT_STACK_ENDPOINT}/#!/stack/${process.env.REACT_APP_CONTENT_STACK_GQL_API_KEY}/content-type/${objectMapping.name}/${locale}/entry/${objectId}/edit` }} target="_blank">
      Open CMS
    </Link>
  )
});

export default CmsCell;