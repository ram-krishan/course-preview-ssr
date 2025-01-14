import { useQuery } from '@apollo/react-hooks';
import { practiceQuestionPreview } from '../../../graphql_states/contentstack';

const usePracticeQuestionQuery = (practiceQuestionCmsId, locale) => {
  const practiceQuestionContent = useQuery(
    practiceQuestionPreview.queries.GET_PRACTICE_QUESTION_DATA,
    { variables: { practiceQuestionCmsId, locale }, fetchPolicy: 'network-only' },
  );

  return {
    loading: practiceQuestionContent.loading,
    practiceQuestionData: practiceQuestionContent.data,
    error: practiceQuestionContent.error
  };
};

export default usePracticeQuestionQuery;
