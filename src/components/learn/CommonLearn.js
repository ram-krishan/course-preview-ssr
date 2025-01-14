import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { isEmpty } from 'lodash';

import { vibGraphqlStates } from '../../../graphql_states';
import Loader from '../../../components/shared/Loader';
import AlertMessage from '../../../components/shared/AlertMessage';


const CommonLearn = () => {
  const { vib_course_id: courseId } = useParams();
  const { data, error, loading } = useQuery(
    vibGraphqlStates.learn.queries.GET_CURRENT_LEARN_PATH,
    { variables: { vibCourseId: courseId }, fetchPolicy: 'network-only' },
  );

  if (loading) return <Loader />;

  if (error) return (<AlertMessage alertType="danger" customClass="mt-3" message={error.graphQLErrors} />);

  if (!isEmpty(data)) {
    return <Redirect to={data.cmsCourse.learnPath} />;
  }
  return <></>;
};

export default CommonLearn;
