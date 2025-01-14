import React from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';

import Loader from '../../components/shared/Loader';
import AlertMessage from '../../shared/AlertMessage';
import Heading from '../../lesson/Heading';
import { useCourseQueries } from './pagePreviewQuery';
import { getPageHeadingFormattedData } from './pageCmsDataFormatter';

const PageHeading = () => {
  let formattedData = {};
  const {
    course_type: courseType,
    content_type: contentType,
    course_cms_id: courseCmsId,
    level_two_collection_cms_id: level2CollectionCmsId,
    level_one_collection_cms_id: level1CollectionCmsId,
    locale,
  } = useParams();

  const {
    courseData,
    levelTwoCollectionData,
    levelOneCollectionData,
    loading,
    error,
  } = useCourseQueries(courseType, courseCmsId, level2CollectionCmsId, level1CollectionCmsId, locale);

  if (courseData && levelTwoCollectionData && levelOneCollectionData) {
    formattedData = getPageHeadingFormattedData(
      courseType, contentType, courseData, levelTwoCollectionData, levelOneCollectionData,
    );
  }

  if (loading) return <Loader />;

  if (error) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="m-3"
        message={error && error.graphQLErrors}
      />
    );
  }

  return (
    !isEmpty(formattedData)
      ? (
        <Heading
          courseTitle={formattedData.courseTitle}
          topic={formattedData.topic}
          lessonTitle={formattedData.lessonTitle}
        />
      )
      : null
  );
};

export default PageHeading;
