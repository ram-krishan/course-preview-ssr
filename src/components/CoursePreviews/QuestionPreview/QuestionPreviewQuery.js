import { useQuery } from '@apollo/react-hooks';
import { questionPreview } from '../../../graphql_states/contentstack';

const useExamQuestionQuery = (examCmsId, questionCmsId, locale) => {
  const examContent = useQuery(
    questionPreview.queries.GET_TOPIC_EXAM_CONTENT,
    { variables: { examCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const questionContent = useQuery(
    questionPreview.queries.GET_TOPIC_EXAM_QUESTION_CONTENT,
    { variables: { questionCmsId, locale }, fetchPolicy: 'network-only' },
  );

  return {
    loading: examContent.loading || questionContent.loading,
    examContentData: examContent.data,
    questionContentData: questionContent.data,
    error: examContent.error || questionContent.error,
  };
};

export default useExamQuestionQuery;
