import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import classNames from 'classnames';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';

import styles from './practice-page.module.scss';
import usePreventReload from '../shared/hooks/UsePreventReload';
import PracticeButton from './PracticeButton';
import Loader from '../../../components/shared/Loader';
import AlertMessage from '../../../components/shared/AlertMessage';
import { vibGraphqlStates, flashMessageState } from '../../../graphql_states';
import QuestionBlock from './QuestionBlock';
import PracticeHeading from './PracticeHeading';
import VibRouteGenerator from '../shared/vib_route_generator';

const PracticeQuestionWrapper = ({ currentUser }) => {
  usePreventReload(true);
  const history = useHistory();

  const {
    measurement_category_id: measurementCategoryId,
    user_course_practice_id: userCoursePracticeId,
    locale,
  } = useParams();

  const [coursePracticeSessionId, setCoursePracticeSessionId] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentPracticeQuestion, setCurrentPracticeQuestion] = useState(null);
  const [currentMeasurementCategory, setCurrentMeasurementCategory] = useState(null);

  const { course } = currentUser.userProfile;

  const isAllMeasurementCategory = measurementCategoryId === 'all';

  const getPracticeQuestionIndex = (practiceQuestions) => {
    if (!currentPracticeQuestion) {
      return 0;
    }
    return practiceQuestions.findIndex(
      (practiceQuestion) => practiceQuestion.id === currentPracticeQuestion.id,
    );
  };

  const { data, error, loading } = useQuery(
    vibGraphqlStates
      .practiceQuestion.queries.GET_PRACTICE_QUESTION_MEASUREMENT_CATEGORY_AND_USER_COURSE_PRACTICE,
    {
      variables: {
        vibMeasurementCategoryId: measurementCategoryId,
        vibCourseId: course.id,
        userCoursePracticeId,
        locale
      },
      fetchPolicy: 'network-only',
      skip: isAllMeasurementCategory,
    },
  );

  const [leavePracticeSession, { loading: leavePractiseSessionLoading }] = useMutation(
    vibGraphqlStates.userPractice.mutations.LEAVE_PRACTICE_SESSION,
  );

  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  const {
    data: assessmentMesasurementCatetoryData,
    error: assessmentMesasurementCatetoryError,
    loading: assessmentMesasurementCatetoryLoading,
  } = useQuery(
    vibGraphqlStates.practiceQuestion.queries
      .GET_ALL_PRACTICE_QUESTION_MEASUREMENT_CATEGORIES_AND_USER_COURSE_PRACTICE,
    {
      variables: { vibCourseId: course.id, userCoursePracticeId, locale },
      fetchPolicy: 'network-only',
      skip: !isAllMeasurementCategory,
    },
  );

  if (loading || assessmentMesasurementCatetoryLoading || leavePractiseSessionLoading) return <Loader />;

  if (error || assessmentMesasurementCatetoryError) {
    const errorObject = error || assessmentMesasurementCatetoryError;
    return (
      <AlertMessage
        alertType="danger"
        customClass="mt-3"
        message={errorObject.graphQLErrors}
      />
    );
  }

  let vibUserCoursePractice;
  let practiceQuestionMeasurementCategories;

  if (data) {
    vibUserCoursePractice = data.vibUserCoursePractice;
    practiceQuestionMeasurementCategories = [
      data.practiceQuestionMeasurementCategory,
    ];
  }

  if (assessmentMesasurementCatetoryData) {
    vibUserCoursePractice = assessmentMesasurementCatetoryData.vibUserCoursePractice;
    practiceQuestionMeasurementCategories = [
      ...assessmentMesasurementCatetoryData.allPracticeQuestionMeasurementCategories,
    ];
  }

  if (!currentMeasurementCategory) {
    const initialMeasurementCategory = practiceQuestionMeasurementCategories[0];
    setCurrentMeasurementCategory(initialMeasurementCategory);
  }

  const switchToNextSetOfPracticeQuestions = () => {
    const totalPracticeQuestionCategories = practiceQuestionMeasurementCategories.length;
    const currentMeasurementCategoryIndex = practiceQuestionMeasurementCategories.findIndex(
      (category) => category.id === currentMeasurementCategory.id,
    );
    if (totalPracticeQuestionCategories === currentMeasurementCategoryIndex + 1) {
      if (coursePracticeSessionId) {
        leavePracticeSession({
          variables: {
            coursePracticeSessionId, locale
          },
        }).then((response) => {
          const {
            success,
            errorMessages,
          } = response.data.leavePracticeSession;
          if (success) {
            history.push(VibRouteGenerator.getPracticePageResultUrl(coursePracticeSessionId));
          } else {
            updateFlashMessage({ variables: { message: errorMessages, messageType: 'danger' } });
          }
        });
      }
    } else {
      const nextMeasurementCategory = practiceQuestionMeasurementCategories[
        currentMeasurementCategoryIndex + 1];
      setCurrentMeasurementCategory(nextMeasurementCategory);
      setCurrentPracticeQuestion(null);
    }
  };

  if (!currentMeasurementCategory) return <Loader />;

  const { title: currentMeasurementCategoryTitle, practiceQuestions } = currentMeasurementCategory;
  const currentIndex = getPracticeQuestionIndex(practiceQuestions);
  const currentPracticeQuestionIndex = currentIndex === -1 ? 0 : currentIndex;

  if (!currentPracticeQuestion && !isEmpty(practiceQuestions)) {
    setCurrentPracticeQuestion(practiceQuestions[currentPracticeQuestionIndex]);
  }

  const getMeasurementCategoryTitle = () => (isAllMeasurementCategory ? null : currentMeasurementCategoryTitle);

  return (
    <>
      <PracticeHeading
        measurementCategoryTitle={getMeasurementCategoryTitle()}
        courseTitle={course.title}
      />
      {
        currentPracticeQuestion
          ? (
            <>
              <Col data-testid="main-container" lg={12} className={classNames(styles['main-container-body'], 'mt-5')}>
                <QuestionBlock
                  question={currentPracticeQuestion.question}
                  userAnswer={userAnswer}
                  selectedAnswers={selectedAnswers}
                  setSelectedAnswers={setSelectedAnswers}
                  currentPracticeQuestionIndex={currentPracticeQuestionIndex + 1}
                  confidenceOfResponse={currentPracticeQuestion.confidenceOfResponse}
                  setUserAnswer={setUserAnswer}
                  noOfQuestion={practiceQuestions.length}
                  vibUserCoursePractice={vibUserCoursePractice}
                  coursePracticeSessionId={coursePracticeSessionId}
                  currentPracticeQuestion={currentPracticeQuestion}
                  setCoursePracticeSessionId={setCoursePracticeSessionId}
                  takingAllMeasurementCategories={isAllMeasurementCategory}
                />
              </Col>
              <PracticeButton
                coursePracticeSessionId={coursePracticeSessionId}
                userAnswer={userAnswer}
                currentPracticeQuestionIndex={currentPracticeQuestionIndex}
                setCurrentPracticeQuestion={setCurrentPracticeQuestion}
                practiceQuestions={practiceQuestions}
                setSelectedAnswers={setSelectedAnswers}
                setUserAnswer={setUserAnswer}
                switchToNextSetOfPracticeQuestions={switchToNextSetOfPracticeQuestions}
              />
            </>
          )
          : null
      }
    </>
  );
};

PracticeQuestionWrapper.propTypes = {
  currentUser: PropTypes.shape({
    userProfile: PropTypes.shape({
      course: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        userCoursePractice: PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default PracticeQuestionWrapper;
