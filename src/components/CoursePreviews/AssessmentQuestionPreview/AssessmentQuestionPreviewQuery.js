import { useQuery } from '@apollo/react-hooks';
import { coursePreview } from '../../../graphql_states/contentstack';

const useExamQuestionQuery = (assessmentCmsId, examCmsId, questionCmsId, locale) => {
  const assessmentContent = useQuery(
    coursePreview.queries.GET_ASSESSMENT_DATA,
    { variables: { uid: assessmentCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const examContent = useQuery(
    coursePreview.queries.GET_ASSESSMENT_EXAM_DATA,
    { variables: { uid: examCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const questionContent = useQuery(
    coursePreview.queries.GET_ASSESSMENT_EXAM_QUESTION_DATA,
    { variables: { uid: questionCmsId, locale }, fetchPolicy: 'network-only' },
  );

  return {
    loading: examContent.loading || questionContent.loading || assessmentContent.loading,
    examContentData: examContent.data,
    questionContentData: questionContent.data,
    assessmentContentData: assessmentContent.data,
    error: examContent.error || questionContent.error || assessmentContent.error,
  };
};

export default useExamQuestionQuery;
