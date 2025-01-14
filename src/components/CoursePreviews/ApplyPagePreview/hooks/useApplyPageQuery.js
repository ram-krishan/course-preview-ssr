import { useQuery } from '@apollo/react-hooks';
import { applyPagePreview } from '../../../../graphql_states/contentstack';
import getLearningResourceFormattedData from '../utils/learningResourceDataFormatter';

const getCourseQuery = (courseType) => {
  let query = null;
  switch (courseType) {
    case 'Level2Course':
      query = applyPagePreview.queries.GET_LEVEL_TWO_LEARNING_RESOURCE_DATA;
      break;
    case 'Level3Course':
      query = applyPagePreview.queries.GET_LEVEL_THREE_LEARNING_RESOURCE_DATA;
      break;
    default:
  }
  return query;
};

const useApplyPageQuery = (courseCmsId, courseType, locale) => {
  const learningResourceContent = useQuery(
    getCourseQuery(courseType),
    { variables: { courseCmsId, locale }, fetchPolicy: 'network-only' },
  );

  if(learningResourceContent.loading) {
    return {
      loading: learningResourceContent.loading,
      learningResourceData: null,
      error: learningResourceContent.error
    }
  }

  return {
    loading: learningResourceContent.loading,
    learningResourceData: getLearningResourceFormattedData(learningResourceContent.data, courseType, courseCmsId),
    error: learningResourceContent.error
  };
};


export default useApplyPageQuery;
