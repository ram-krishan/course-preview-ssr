import React from 'react';
import { useParams } from 'react-router-dom';
import PagePreview from '../PagePreview';

const CmsPreview = () => {

  const {
    pageCmsId,
    locale,
  } = useParams();

  return (
    <>
      <PagePreview
        pageCmsId={pageCmsId}
        locale={locale}
      />
    </>
  );
};

export default CmsPreview;
