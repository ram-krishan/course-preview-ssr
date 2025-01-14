import React, { useState } from 'react';
import classNames from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  get,
  last,
  sortBy,
  isEmpty,
} from 'lodash';
import ExamCompleted from '../ExamCompleted';

import Heading from './Heading';
import QuestionBody from './QuestionBody';
import LessonSection from '../../shared/LessonSection';
import Loader from '../../../../../components/shared/Loader';
import AlertMessage from '../../../../../components/shared/AlertMessage';
import { vibGraphqlStates } from '../../../../../graphql_states';
import ProductExperienceSurvey from '../../product_experience';
import PageNotFound from '../../../shared/PageNotFound';

import styles from '../../lesson-page.module.scss';

const Questions = ({ location }) => {
  const {
    vib_course_id: courseId,
    vib_level_two_collection_course_id: lvl2CollectionCourseId,
  } = useParams();

  const params = new URLSearchParams(location.search);
  const lastQuestion = params.get('lq');
  const canShowLastQuestion = !isEmpty(lastQuestion) && lastQuestion === 't';
  const [isExamRevisiting, setIsExamRevisiting] = useState(false);

  const { data, error, loading } = useQuery(
    vibGraphqlStates.question.queries.GET_LEVEL_TWO_COLLECTION_PROGRESS,
    {
      variables: { levelTwoCollectionCourseId: lvl2CollectionCourseId },
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
  const { levelTwoCollectionProgress } = data;

  if (isEmpty(levelTwoCollectionProgress)) return <PageNotFound />;

  const {
    id: lvl2CollectionProgressId,
    levelTwoCollectionCourse: {
      levelTwoCollection,
    },
    levelTwoCollectionExamUserProgress,
    contentType,
  } = levelTwoCollectionProgress;


  if (isEmpty(levelTwoCollectionExamUserProgress)) return <PageNotFound />;

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

  const getLastLessonPath = () => (
    `/l/courses/${courseId}/lessons/${getLastLvlTwoLvlOneCollectionId()}/progress/${lvl2CollectionProgressId}`
  );

  if (isEmpty(levelTwoCollection.exam)) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="mt-3"
        message={<FormattedMessage id="course.exam.noExamAvaialble" />}
      />
    );
  }

  const handleExamCompleted = () => {
    setIsExamRevisiting(true);
  };

  if (isExamProgressCompleted() && !isExamRevisiting) {
    if (canShowLastQuestion) {
      setIsExamRevisiting(true);
    }

    return (
      <ExamCompleted
        lastLessonPath={getLastLessonPath()}
        levelTwoCollectionTitle={levelTwoCollection.title}
        handleExamCompleted={handleExamCompleted}
        contentType={contentType}
      />
    );
  }

  return (
    <div data-testid="question-wrapper">
      <ProductExperienceSurvey />
      <LessonSection>
        <div className={classNames(styles['lesson-container'])}>
          <Heading
            lastLessonPath={getLastLessonPath()}
            levelTwoCollectionTitle={levelTwoCollection.title}
            contentType={contentType}
          />

          <QuestionBody
            isExamProgressCompleted={isExamProgressCompleted()}
            isExamRevisiting={isExamRevisiting}
            canShowLastQuestion={canShowLastQuestion}
            lastLessonPath={getLastLessonPath()}
            levelTwoCollection={levelTwoCollection}
            lvl2CollectionCourseId={lvl2CollectionCourseId}
            levelTwoCollectionExamUserProgress={levelTwoCollectionExamUserProgress}
          />
        </div>
      </LessonSection>
    </div>
  );
};

Questions.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};
export default Questions;
