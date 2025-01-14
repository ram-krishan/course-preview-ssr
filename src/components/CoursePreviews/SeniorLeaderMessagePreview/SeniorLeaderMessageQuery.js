import { seniorLeaderMessagePreview } from '../../../graphql_states/contentstack';

const getCourseQuery = (courseType) => {
  let query = null;
  switch (courseType) {
    case 'Level2Course':
      query = seniorLeaderMessagePreview.queries.GET_LEVEL_TWO_COURSE_GOALS;
      break;
    case 'Level3Course':
      query = seniorLeaderMessagePreview.queries.GET_LEVEL_THREE_COURSE_GOALS;
      break;
    default:
  }
  return query;
};

const getSeniorLeaderMessageData = (client, courseType, courseId, seniorLeaderMessageCmsId, locale) => {
  // SLM CONTENT QUERY
  const seniorLeaderMessageContent = client.query({
    query: seniorLeaderMessagePreview.queries.GET_SENIOR_LEADER_MESSAGE_CONTENT,
    variables: { seniorLeaderMessageCmsId, locale }, fetchPolicy: 'network-only' },
  );

  // COURSE GOALS QUERY
  const seniorLeaderMessageGoalsContent = client.query({
    query: getCourseQuery(courseType),
    variables: { courseId, locale }, fetchPolicy: 'network-only' }
  )

   return {
    loading: seniorLeaderMessageContent.loading || seniorLeaderMessageGoalsContent.loading,
    seniorLeaderMessageData: seniorLeaderMessageContent.data,
    seniorLeaderMessageGoalsData: seniorLeaderMessageGoalsContent.data,
    error: seniorLeaderMessageContent.error || seniorLeaderMessageGoalsContent.error,
  };
};

export default getSeniorLeaderMessageData;
