import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { useIntl, intlShape, FormattedMessage } from 'react-intl';
import { useHistory, Link } from 'react-router-dom';
import {
  find, isEmpty, map,
} from 'lodash';
import classNames from 'classnames';


import { RoundedChevronLeft, RoundedChevronRight } from '../shared/vib_icons';
import PageWrapper from '../shared/page_wrapper';
import Loader from '../../../components/shared/Loader';
import AlertMessage from '../../../components/shared/AlertMessage';
import { vibGraphqlStates, flashMessageState } from '../../../graphql_states';
import MainContent from './MainContent';
import SecondaryContent from './SecondaryContent';
import ConnectiveTissue from './ConnectiveTissue';
import VibButton from '../shared/vib_button';
import VibRouteGenerator from '../shared/vib_route_generator';
import PageTitle from './PageTitle';
import Loading from '../shared/loading';
import styles from './lesson-page.module.scss';
import { nextLinkText, previousLinkText } from './shared/pageNavigationUtils';

const Page = ({
  levelOneCollection,
  progressId,
  setProgressId,
  previousPageProgressData,
  setPreviousPageProgressData,
  currentQuestionId,
  setCurrentQuestionId,
  currentSurveyQuestionId,
  setCurrentSurveyQuestionId,
  userAnswers,
  setUserAnswers,
  selectedAnswers,
  setSelectedAnswers,
  levelTwoCollectionProgressId,
  courseId,
  hasExam,
  levelTwoCollection,
  intl,
}) => {
  const history = useHistory();

  const [completePage, { loading }] = useMutation(
    vibGraphqlStates.lesson.mutations.COMPLETE_PAGE,
  );
  const [submitPageQuestionAnswer, { loading: questionLoading }] = useMutation(
    vibGraphqlStates.lesson.mutations.SUBMIT_PAGE_QUESTION_ANSWER,
  );
  const [submitPageSurveyQuestionAnswer, { loading: surveyQuestionLoading }] = useMutation(
    vibGraphqlStates.lesson.mutations.SUBMIT_PAGE_SURVEY_QUESTION_ANSWER,
  );
  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  const {
    data, error, loading: loadingPage,
  } = useQuery(
    vibGraphqlStates.lesson.queries.GET_PAGE,
    {
      variables: {
        pageProgressId: progressId,
        shouldUpdateStatus: true,
      },
      fetchPolicy: 'network-only',
    },
  );
  if (loadingPage) return <Loader />;
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

  const hasAnyQuestion = (collection) => (
    find(collection, (item) => (item.type === 'PageComponentsComponentsQuestionReference' && item.question)
      || (item.type === 'PageComponentsComponentsSurveyQuestionReference' && item.surveyQuestion))
  );


  const {
    page: { title },
    previousPageProgressId,
    perviousLevelOneCollectionUrl,
    parentLevelTwoCollectionUrl,
    previousLevelTwoCollection,
  } = data.pageProgress;

  const {
    showSecondaryContent, secondaryContentPosition, mainContent, secondaryContent, topConnectiveTissue, bottomConnectiveTissue,
  } = data.pageProgress.page.pageContent;

  let secondaryWidth = '0';
  let secondaryPosition = 'left';
  let firstQuestion = null;

  if (showSecondaryContent) {
    secondaryWidth = secondaryContentPosition.width;
    secondaryPosition = secondaryContentPosition.position;
    firstQuestion = hasAnyQuestion(secondaryContent);
  }

  if (
    isEmpty(previousPageProgressData)
    && (!isEmpty(previousPageProgressId) || !isEmpty(parentLevelTwoCollectionUrl) || !isEmpty(perviousLevelOneCollectionUrl))
  ) {
    setPreviousPageProgressData({
      ...previousPageProgressData,
      previousPageProgressId,
      perviousLevelOneCollectionUrl,
      parentLevelTwoCollectionUrl,
    });
  }

  if (hasAnyQuestion(mainContent)) {
    firstQuestion = hasAnyQuestion(mainContent);
  }
  if (firstQuestion) {
    if (firstQuestion.question && firstQuestion.question.id !== currentQuestionId) {
      setCurrentQuestionId(firstQuestion.question.id);
      setUserAnswers(map(firstQuestion.question.submittedAnswers, 'id'));
    } else if (isEmpty(currentQuestionId) && firstQuestion.surveyQuestion && firstQuestion.surveyQuestion.id !== currentSurveyQuestionId) {
      setCurrentSurveyQuestionId(firstQuestion.surveyQuestion.id);
      if (firstQuestion.surveyQuestion.submittedAnswer) {
        setUserAnswers([firstQuestion.surveyQuestion.submittedAnswer.id]);
      }
    }
  }

  const redirectUrl = (nextLevelTwoLevelOneCollectionId, nextLevelTwoCollectionProgressId, nextLearnPath, examUrl) => {
    if (hasExam && examUrl) {
      return (examUrl);
    }
    if (nextLevelTwoLevelOneCollectionId) {
      const nextLvl2CollectionId = levelTwoCollectionProgressId;
      if (nextLevelTwoCollectionProgressId) {
        return (nextLearnPath || VibRouteGenerator.getTodayPageUrl());
      }
      return (`/l/courses/${courseId}/lessons/${nextLevelTwoLevelOneCollectionId}/progress/${nextLvl2CollectionId}`);
    }
    return VibRouteGenerator.getTodayPageUrl();
  };

  const handleCompletePage = () => completePage({
    variables: {
      levelOneCollectionProgressId: levelOneCollection.levelOneCollectionProgress.id,
      pageProgressId: progressId,
      courseId,
      questionId: currentQuestionId,
    },
  }).then((response) => {
    const {
      success,
      errorMessages,
      shouldRedirectToNextLevelOneCollection,
      nextPageProgressId,
      nextLevelTwoLevelOneCollectionId,
      nextLevelTwoCollectionProgressId,
      isAllCoreContentCompletedAndNoEnrichmentStart,
      examUrl,
      nextLearnPath,
    } = response.data.completePage;
    if (success) {
      if (isAllCoreContentCompletedAndNoEnrichmentStart) {
        history.push(VibRouteGenerator.getTodayPageUrl());
      } else if (shouldRedirectToNextLevelOneCollection || (nextPageProgressId === null)) {
        history.push(redirectUrl(nextLevelTwoLevelOneCollectionId, nextLevelTwoCollectionProgressId, nextLearnPath, examUrl));
      } else {
        setProgressId(nextPageProgressId);
      }
    } else {
      updateFlashMessage({ variables: { message: errorMessages, messageType: 'danger' } });
    }
  });
  const submitPageQuestion = () => (
    submitPageQuestionAnswer({
      variables: {
        answerIds: selectedAnswers,
        pageProgressId: progressId,
        questionId: currentQuestionId,
      },
    }).then((response) => {
      const {
        success,
        errorMessages,
      } = response.data.submitPageQuestionAnswer;
      if (success) {
        setUserAnswers(selectedAnswers);
      } else {
        updateFlashMessage({ variables: { message: errorMessages, messageType: 'danger' } });
      }
    })
  );
  const submitPageSurveyQuestion = (surveyAnswerId) => (
    submitPageSurveyQuestionAnswer({
      variables: {
        levelOneCollectionProgressId: levelOneCollection.levelOneCollectionProgress.id,
        surveyAnswerId,
        pageProgressId: progressId,
        surveyQuestionId: currentSurveyQuestionId,
        courseId,
      },
    }).then((response) => {
      const {
        success,
        errorMessages,
        shouldRedirectToNextLevelOneCollection,
        nextPageProgressId,
        nextLevelTwoLevelOneCollectionId,
        nextLevelTwoCollectionProgressId,
        nextLearnPath,
        examUrl,
      } = response.data.submitPageSurveyQuestionAnswer;
      if (success) {
        if (shouldRedirectToNextLevelOneCollection || (nextPageProgressId === null)) {
          history.push(redirectUrl(nextLevelTwoLevelOneCollectionId, nextLevelTwoCollectionProgressId, nextLearnPath, examUrl));
        } else {
          setProgressId(nextPageProgressId);
        }
      } else {
        updateFlashMessage({ variables: { message: errorMessages, messageType: 'danger' } });
      }
    })
  );

  const handleSubmit = () => {
    if (!isEmpty(currentQuestionId)) {
      submitPageQuestion();
      return;
    }
    if (!isEmpty(currentSurveyQuestionId)) {
      const [surveyAnswerId] = selectedAnswers;
      submitPageSurveyQuestion(surveyAnswerId);
    }
  };

  const handlePreviousSubmit = () => {
    if (!isEmpty(previousPageProgressData)) {
      if (previousPageProgressData.previousPageProgressId) {
        setProgressId(previousPageProgressData.previousPageProgressId);
      } else if (!isEmpty(previousPageProgressData.perviousLevelOneCollectionUrl)) {
        history.push({
          pathname: previousPageProgressData.perviousLevelOneCollectionUrl,
          state: { isBackPageTraverse: true },
        });
      } else {
        history.push({
          pathname: previousPageProgressData.parentLevelTwoCollectionUrl,
          state: { isBackPageTraverse: true },
        });
      }
    }
  };

  const isCurrentQuestionPresent = () => (!isEmpty(currentQuestionId) || !isEmpty(currentSurveyQuestionId));

  const showSubmitButton = () => (isCurrentQuestionPresent() && isEmpty(userAnswers));

  const isSubmitDisabled = () => isEmpty(selectedAnswers);

  const isContinueDisabled = () => {
    if (isCurrentQuestionPresent()) {
      return (isEmpty(userAnswers));
    }
    return (false);
  };

  const isOldSubmittedQuestionAnswerChanged = () => {
    if (isEmpty(firstQuestion)) return false;
    if (isEmpty(firstQuestion.question)) return false;

    return firstQuestion.question.isOldSubmittedAnswerChanged;
  };

  return (
    <div data-testid="page-content">
      {title ? <PageTitle title={title} /> : null}
      {
        topConnectiveTissue
          ? (
            <ConnectiveTissue
              connectiveTissueContent={topConnectiveTissue.content}
              setSelectedAnswers={setSelectedAnswers}
              userAnswers={userAnswers}
              selectedAnswers={selectedAnswers}
              currentQuestionId={currentQuestionId}
              currentSurveyQuestionId={currentSurveyQuestionId}
              courseId={courseId}
              setCurrentQuestionId={setCurrentQuestionId}
              setUserAnswers={setUserAnswers}
              setCurrentSurveyQuestionId={setCurrentSurveyQuestionId}
              className="cs-top"
            />
          )
          : null
      }
      <PageWrapper
        secondaryColumnWidth={secondaryWidth.replace('%', '')}
        secondaryColumnPosition={secondaryPosition}
      >
        <MainContent
          mainContent={mainContent}
          isOldSubmittedQuestionAnswerChanged={isOldSubmittedQuestionAnswerChanged()}
          setSelectedAnswers={setSelectedAnswers}
          userAnswers={userAnswers}
          selectedAnswers={selectedAnswers}
          currentQuestionId={currentQuestionId}
          currentSurveyQuestionId={currentSurveyQuestionId}
          courseId={courseId}
          setCurrentQuestionId={setCurrentQuestionId}
          setUserAnswers={setUserAnswers}
          setCurrentSurveyQuestionId={setCurrentSurveyQuestionId}
        />
        {showSecondaryContent
          ? (
            <SecondaryContent
              secondaryContent={secondaryContent}
              setSelectedAnswers={setSelectedAnswers}
              userAnswers={userAnswers}
              selectedAnswers={selectedAnswers}
              currentQuestionId={currentQuestionId}
              currentSurveyQuestionId={currentSurveyQuestionId}
              courseId={courseId}
              setCurrentQuestionId={setCurrentQuestionId}
              setUserAnswers={setUserAnswers}
              setCurrentSurveyQuestionId={setCurrentSurveyQuestionId}
            />
          ) : null}
      </PageWrapper>
      {
        bottomConnectiveTissue
          ? (
            <ConnectiveTissue
              connectiveTissueContent={bottomConnectiveTissue.content}
              setSelectedAnswers={setSelectedAnswers}
              userAnswers={userAnswers}
              selectedAnswers={selectedAnswers}
              currentQuestionId={currentQuestionId}
              currentSurveyQuestionId={currentSurveyQuestionId}
              courseId={courseId}
              className="cs-bottom"
              setCurrentQuestionId={setCurrentQuestionId}
              setUserAnswers={setUserAnswers}
              setCurrentSurveyQuestionId={setCurrentSurveyQuestionId}
            />
          )
          : null
      }
      <div className="d-flex justify-content-center align-items-center pt-4 pb-4">
        {
        showSubmitButton()
          ? (
            <VibButton
              handleSubmit={handleSubmit}
              classes={styles['lesson-page-submit-btn']}
              isDisabled={isSubmitDisabled()}
              isLoading={questionLoading || surveyQuestionLoading}
              variant="outline-secondary"
            >
              <FormattedMessage id="page.button.submit" />
            </VibButton>
          )
          : null
        }
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className={`d-flex ${previousLinkText(levelTwoCollection, levelOneCollection, data.pageProgress.page, previousLevelTwoCollection, intl).length >= 60 ? 'align-items-start' : 'align-items-center'}`}>
          <VibButton
            handleSubmit={handlePreviousSubmit}
            variant="secondary"
            classes={classNames(styles['next-prev-btn'], styles['prev-btn'])}
          >
            <RoundedChevronLeft fillColor="#fff" />
            <FormattedMessage id="page.button.back" />
          </VibButton>
          <span className={classNames(styles['back-and-next-text'], 'ml-3')}>
            {previousLinkText(levelTwoCollection, levelOneCollection, data.pageProgress.page, previousLevelTwoCollection, intl)}
          </span>
        </div>
        <div className={`d-flex ${nextLinkText(levelTwoCollection, levelOneCollection, data.pageProgress.page, hasExam, intl).length >= 60 ? 'align-items-start' : 'align-items-center'}`}>
          <span data-testid="next-button" className={classNames(styles['back-and-next-text'], 'mr-3 text-right')}>
            {nextLinkText(levelTwoCollection, levelOneCollection, data.pageProgress.page, hasExam, intl)}
          </span>
          <VibButton
            handleSubmit={handleCompletePage}
            isDisabled={isContinueDisabled()}
            variant="secondary"
            classes={classNames(styles['next-prev-btn'], styles['next-btn'])}
          >
            <FormattedMessage id="button.next" />
            <RoundedChevronRight fillColor="#fff" />
          </VibButton>
        </div>
      </div>
    </div>
  );
};

Page.propTypes = {
  intl: intlShape.isRequired,
  levelOneCollection: PropTypes.instanceOf(Object).isRequired,
  levelTwoCollectionProgressId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  hasExam: PropTypes.bool.isRequired,
  levelTwoCollection: PropTypes.instanceOf(Object).isRequired,
};
export default (useIntl(Page));
