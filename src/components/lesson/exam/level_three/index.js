import React, { useState } from 'react';
import classNames from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  get,
  last,
  sortBy,
  isEmpty,
} from 'lodash';

import ExamCompleted from '../ExamCompleted';
import Heading from '../questions/Heading';
import QuestionBody from '../questions/QuestionBody';
import LessonSection from '../../shared/LessonSection';
import Loader from '../../../../../components/shared/Loader';
import AlertMessage from '../../../../../components/shared/AlertMessage';
import { vibGraphqlStates } from '../../../../../graphql_states';
import ProductExperienceSurvey from '../../product_experience';
import PageNotFound from '../../../shared/PageNotFound';

import styles from '../../lesson-page.module.scss';

const LevelThreeQuestions = ({ location }) => {
  const {
    vib_level_three_level_two_collection_id: lvl3Lvl2CollectionId,
    vib_level_three_collection_course_id: lvl3CollectionCourseId,
  } = useParams();
  const params = new URLSearchParams(location.search);
  const lastQuestion = params.get('lq');
  const canShowLastQuestion = !isEmpty(lastQuestion) && lastQuestion === 't';
  const [isExamRevisiting, setIsExamRevisiting] = useState(false);


  const { data, error, loading } = useQuery(
    vibGraphqlStates.question.queries.GET_LEVEL_THREE_COLLECTION_PROGRESS,
    {
      variables: {
        levelThreeCollectionCourseId: lvl3CollectionCourseId,
        levelThreeLevelTwoCollectionId: lvl3Lvl2CollectionId,
      },
      fetchPolicy: 'network-only',
    },
  );
  if (loading) return <Loader />;

  if (error) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="mt-3"
        message={error.graphQLErrors}
      />
    );
  }

  const { levelThreeCollectionProgress } = data;

  if (isEmpty(levelThreeCollectionProgress)) return <PageNotFound />;
  const {
    levelThreeCollectionCourse,
    levelThreeCollection,
    levelTwoCollectionExamUserProgress,
  } = levelThreeCollectionProgress;

  if (isEmpty(levelTwoCollectionExamUserProgress)) return <PageNotFound />;

  const { levelTwoCollection } = levelThreeCollection.levelThreeLevelTwoCollection;
  const { levelTwoCollectionProgress } = levelTwoCollectionExamUserProgress;
  const { course } = levelThreeCollectionCourse.levelThreeCourse;
  const getLastLvlTwoLvlOneCollectionId = () => {
    const sortedLvlTwoLvlOneCollections = sortBy(
      levelTwoCollection.levelTwoLevelOneCollections, 'position',
    );
    return get(last(sortedLvlTwoLvlOneCollections), 'id');
  };

  const isExamProgressCompleted = () => (
    levelTwoCollectionExamUserProgress
    && levelTwoCollectionExamUserProgress.status === 'completed'
  );

  if (isEmpty(levelTwoCollection.exam)) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="mt-3"
        message={<h1 id="course.exam.youHaveAlreadyTakenTheExam" />}
      />
    );
  }

  const handleExamCompleted = () => {
    setIsExamRevisiting(true);
  };

  const getLastLessonPath = () => (
    `/l/courses/${course.id}/lessons/${getLastLvlTwoLvlOneCollectionId()}/progress/${levelTwoCollectionProgress.id}`
  );


  if (isExamProgressCompleted() && !isExamRevisiting) {
    if (canShowLastQuestion) {
      setIsExamRevisiting(true);
    }

    return (
      <ExamCompleted
        lastLessonPath={getLastLessonPath()}
        levelTwoCollectionTitle={levelTwoCollection.title}
        contentType={levelTwoCollectionProgress.contentType}
        handleExamCompleted={handleExamCompleted}
      />
    );
  }

  return (
    <>
      <ProductExperienceSurvey />
      <LessonSection>
        <div className={classNames(styles['lesson-container'])}>
          <Heading
            lastLessonPath={getLastLessonPath()}
            levelTwoCollectionTitle={levelTwoCollection.title}
            examTitle={levelTwoCollection.exam.title}
            contentType={levelTwoCollectionProgress.contentType}
          />

          <QuestionBody
            isExamProgressCompleted={isExamProgressCompleted()}
            canShowLastQuestion={canShowLastQuestion}
            isExamRevisiting={isExamRevisiting}
            lastLessonPath={getLastLessonPath()}
            levelTwoCollection={levelTwoCollection}
            levelTwoCollectionExamUserProgress={levelTwoCollectionExamUserProgress}
          />
        </div>
      </LessonSection>
    </>
  );
};

LevelThreeQuestions.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};
export default LevelThreeQuestions;
