import React from 'react';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';

import AlertMessage from '../../shared/AlertMessage';
import Loader from '../../shared/Loader';
import useLevelTwoCollectionQuery from './LevelTwoCollectionPreviewQuery';
import L2BreakRoomPage from './L2BreakRoomPage';
import getCourseCmsFormattedData from './CourseCmsDataFormatter';

const LevelTwoCollectionPreview = () => {
  const {
    levelTwoCollectionCmsId,
    levelThreeCollectionCmsId,
    levelFourCollectionCmsId,
    courseCmsId,
    courseType,
    contentType,
    locale,
  } = useParams();

  let formattedData = {};

  const {
    lvl2CollectionContentData,
    courseData,
    loading,
    error,
  } = useLevelTwoCollectionQuery(levelTwoCollectionCmsId, courseCmsId, courseType, contentType, locale);
  if (courseData && lvl2CollectionContentData) {
    formattedData = getCourseCmsFormattedData(courseData, lvl2CollectionContentData, courseType, contentType, levelTwoCollectionCmsId, levelThreeCollectionCmsId, levelFourCollectionCmsId, courseCmsId);
  }
  if (loading) return <Loader />;

  if (error) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="m-3"
        message={!isEmpty(error) && error.graphQLErrors}
      />
    );
  }

  return (
    <>
      <L2BreakRoomPage
        courseData={formattedData.data}
        l3CollectionCmsId={levelThreeCollectionCmsId}
        l4CollectionCmsId={levelFourCollectionCmsId}
        locale={locale}
      />
    </>
  );
};

export default LevelTwoCollectionPreview;
