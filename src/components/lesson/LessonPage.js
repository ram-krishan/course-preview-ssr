import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { isEmpty } from 'lodash';
import LessonPageContent from './LessonPageContent';
import Loader from '../../../components/shared/Loader';
import AlertMessage from '../../../components/shared/AlertMessage';
import { vibGraphqlStates } from '../../../graphql_states';
import PageNotFound from '../shared/PageNotFound';

const LessonPage = ({
  courseId,
  vibLevelTwoLevelOneCollectionId,
  levelTwoCollectionProgressId,
}) => {
  const {
    data, error, loading,
  } = useQuery(
    vibGraphqlStates.lesson.queries.GET_LEVEL_TWO_LEVEL_ONE_COLLECTION,
    {
      variables: {
        vibCourseId: courseId,
        vibLevelTwoLevelOneCollectionId,
        levelTwoCollectionProgressId,
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
        customClass="m-3"
        message={errorObject && errorObject.graphQLErrors}
      />
    );
  }

  const {
    position,
    levelTwoCollection,
    levelOneCollection,
  } = data.vibLevelTwoLevelOneCollection;

  const {
    currentLevelTwoCollectionCount, levelTwoCollectionCount
  } = data.cmsCourse.levelCourse;

  const isTopicProgressLocked = () => (
    !levelTwoCollection
    || levelTwoCollection.levelTwoCollectionProgress.status === 'locked'
    || !levelOneCollection
    || isEmpty(levelOneCollection.levelOneCollectionProgress)
    || levelOneCollection.levelOneCollectionProgress.status === 'locked'
  );

  return (
    isTopicProgressLocked()
      ? <PageNotFound />
      : (
        <LessonPageContent
          courseId={courseId}
          position={position}
          course={data.cmsCourse}
          currentLevelTwoCollectionCount={currentLevelTwoCollectionCount}
          levelTwoCollectionCount={levelTwoCollectionCount}
          levelTwoCollection={levelTwoCollection}
          levelOneCollection={levelOneCollection}
          hasExam={!(levelTwoCollection.exam === null)}
          vibLevelTwoCollectionCourseId={levelTwoCollection.levelTwoCollectionProgress.parent.id}
          levelTwoLevelOneCollections={levelTwoCollection.levelTwoLevelOneCollections}
          vibLevelTwoLevelOneCollectionId={vibLevelTwoLevelOneCollectionId}
          levelTwoCollectionProgressId={levelTwoCollectionProgressId}
        />
      )

  );
};

LessonPage.propTypes = {
  courseId: PropTypes.string.isRequired,
  levelTwoCollectionProgressId: PropTypes.string.isRequired,
  vibLevelTwoLevelOneCollectionId: PropTypes.string.isRequired,
};

export default LessonPage;
