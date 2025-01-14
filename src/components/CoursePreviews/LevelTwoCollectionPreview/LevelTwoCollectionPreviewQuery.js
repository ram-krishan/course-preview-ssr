import { useQuery } from '@apollo/react-hooks';
import { levelTwoCollectionPreview } from '../../../graphql_states/contentstack';

const useLevelTwoCollectionQuery = (
  levelTwoCollectionCmsId, courseCmsId, courseType, contentType, locale
) => {
  const getL3CourseQuery = () => {
    if (contentType === 'core') {
      return levelTwoCollectionPreview.queries.GET_LEVEL_THREE_COURSE_CORE_DATA;
    }
    return levelTwoCollectionPreview.queries.GET_LEVEL_THREE_COURSE_ENRICHMENT_DATA;
  };

  const getLevelCourseQuery = () => {
    let mainQuery = null;
    switch (courseType) {
      case 'Level2Course':
        mainQuery = levelTwoCollectionPreview.queries.GET_LEVEL_TWO_COURSE_DATA;
        break;
      case 'Level3Course':
        mainQuery = getL3CourseQuery();
        break;
      default:
        throw new Error(`Sorry, we are out of ${courseType}.`);
    }
    return mainQuery;
  };

  const levelCourseQuery = getLevelCourseQuery();
  const courseData = useQuery(
    levelCourseQuery,
    { variables: { uid: courseCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const lvl2CollectionContent = useQuery(
    levelTwoCollectionPreview.queries.GET_LEVEL_TWO_COLLECTION_CONTENT,
    {
      variables: { levelTwoCollectionCmsId, locale },
      fetchPolicy: 'network-only',
    },
  );

  return {
    loading: lvl2CollectionContent.loading || courseData.loading,
    lvl2CollectionContentData: lvl2CollectionContent.data,
    courseData: courseData.data,
    error: lvl2CollectionContent.error || courseData.error,
  };
};

export default useLevelTwoCollectionQuery;
