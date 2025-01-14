import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import Loader from '../../../components/shared/Loader';
import AlertMessage from '../../../components/shared/AlertMessage';
import { vibGraphqlStates } from '../../../graphql_states';
import AssessmentQuestionAnswer from './AssessmentQuestionAnswer';

const QuestionAnswerBlock = ({
  vibAssessmentAttemptId,
  vibExamId,
  vibCourseId,
  locale,
}) => {
  const { data, error, loading } = useQuery(
    vibGraphqlStates.assessment.exam.queries.GET_EXAM_QUESTION_ANSWERS,
    {
      variables: {
        vibCourseId,
        vibExamId,
        vibAssessmentAttemptId,
        locale,
      },
      fetchPolicy: 'network-only',
    },
  );

  if (loading) return <Loader />;
  if (error) {
    const errorObject = error;
    return (
      <AlertMessage
        alertType="danger"
        customClass="mt-3"
        message={errorObject && errorObject.graphQLErrors}
      />
    );
  }

  return (
    <AssessmentQuestionAnswer
      courseAssessmentAttempt={data.courseAssessmentAttempt}
      vibAssessmentAttemptId={vibAssessmentAttemptId}
      vibCourseId={vibCourseId}
    />
  );
};

QuestionAnswerBlock.propTypes = {
  vibExamId: PropTypes.string.isRequired,
  vibAssessmentAttemptId: PropTypes.string.isRequired,
  vibCourseId: PropTypes.string.isRequired,
};

export default QuestionAnswerBlock;
